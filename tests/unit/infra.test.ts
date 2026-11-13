/**
 * Guarda da infraestrutura em contêiner (ADR-0003): roda em todo CI, sem
 * Docker. O teste de verdade (build das imagens e cluster kind) está no
 * workflow k8s.yml; aqui ficam as regras que nunca podem regredir.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseAllDocuments } from "yaml";
import { describe, expect, it } from "vitest";

type Obj = Record<string, unknown>;
const ler = (p: string): string => readFileSync(join(process.cwd(), p), "utf8");
const docs = (p: string): Obj[] =>
  parseAllDocuments(ler(p))
    .map((d) => d.toJS() as Obj)
    .filter(Boolean);
const base = readdirSync("k8s/base")
  .filter((f) => f.endsWith(".yaml") && f !== "kustomization.yaml")
  .flatMap((f) => docs(`k8s/base/${f}`));
const doTipo = (k: string): Obj[] => base.filter((d) => d["kind"] === k);
const caminho = (o: unknown, ...ks: string[]): unknown => ks.reduce<unknown>((a, k) => (a as Obj | undefined)?.[k], o);

describe("Deployments seguem o perfil restrito", () => {
  const deps = doTipo("Deployment");
  it("existem web e api", () => {
    expect(deps.map((d) => caminho(d, "metadata", "name")).sort()).toEqual(["api", "web"]);
  });
  for (const d of deps) {
    const nome = String(caminho(d, "metadata", "name"));
    const pod = caminho(d, "spec", "template", "spec") as Obj;
    const containers = pod["containers"] as Obj[];
    it(`${nome}: pod não-root, seccomp e sem token`, () => {
      expect(caminho(pod, "securityContext", "runAsNonRoot")).toBe(true);
      expect(caminho(pod, "securityContext", "seccompProfile", "type")).toBe("RuntimeDefault");
      expect(pod["automountServiceAccountToken"]).toBe(false);
    });
    for (const c of containers) {
      it(`${nome}/${String(c["name"])}: contêiner endurecido, com probes e limites`, () => {
        expect(caminho(c, "securityContext", "allowPrivilegeEscalation")).toBe(false);
        expect(caminho(c, "securityContext", "readOnlyRootFilesystem")).toBe(true);
        expect(caminho(c, "securityContext", "capabilities", "drop")).toEqual(["ALL"]);
        expect(c["readinessProbe"]).toBeTruthy();
        expect(c["livenessProbe"]).toBeTruthy();
        expect(caminho(c, "resources", "requests")).toBeTruthy();
        expect(caminho(c, "resources", "limits", "memory")).toBeTruthy();
        expect(String(c["image"])).not.toMatch(/:latest$/);
      });
    }
    it(`${nome}: atualização sem indisponibilidade e PDB`, () => {
      expect(caminho(d, "spec", "strategy", "rollingUpdate", "maxUnavailable")).toBe(0);
      expect(Number(caminho(d, "spec", "replicas"))).toBeGreaterThanOrEqual(2);
      const pdb = doTipo("PodDisruptionBudget").find((p) => caminho(p, "metadata", "name") === nome);
      expect(pdb).toBeTruthy();
    });
  }
});

describe("rede", () => {
  const pols = doTipo("NetworkPolicy");
  it("nega tudo por padrão", () => {
    const n = pols.find((p) => caminho(p, "metadata", "name") === "nega-tudo");
    expect(caminho(n, "spec", "podSelector")).toEqual({});
    expect(caminho(n, "spec", "policyTypes")).toEqual(["Ingress", "Egress"]);
    expect(caminho(n, "spec", "ingress")).toBeUndefined();
  });
  it("API só aceita o web e não tem saída", () => {
    const api = pols.find((p) => caminho(p, "metadata", "name") === "api");
    const de = caminho(api, "spec", "ingress") as Obj[];
    expect(de).toHaveLength(1);
    expect(caminho((de[0]?.["from"] as Obj[])[0], "podSelector", "matchLabels")).toEqual({ "app.kubernetes.io/name": "web" });
    expect(caminho(api, "spec", "egress")).toBeUndefined();
  });
  it("namespace exige o perfil restrito do Pod Security", () => {
    const ns = doTipo("Namespace")[0];
    expect(caminho(ns, "metadata", "labels", "pod-security.kubernetes.io/enforce")).toBe("restricted");
  });
});

describe("imagens e nginx", () => {
  it("Dockerfile roda como usuário sem privilégio e fixa versões das bases", () => {
    const df = ler("Dockerfile");
    expect(df).toMatch(/^USER node$/m);
    expect(df).toMatch(/nginx-unprivileged:\d/);
    expect(df).toMatch(/node:\d+-alpine/);
    expect(df).not.toMatch(/:latest/);
    /* toda imagem base fixada por digest */
    const bases = [...df.matchAll(/^ARG \w+_IMAGE=(\S+)$/gm)].map((m) => m[1] ?? "");
    expect(bases.length).toBeGreaterThanOrEqual(2);
    for (const b of bases) expect(b).toMatch(/@sha256:[0-9a-f]{64}$/);
  });
  it("imagem da API não leva npm/npx/corepack (só o node roda em produção)", () => {
    const api = ler("Dockerfile").split(/^FROM /m).find((b) => /AS api\s*$/m.test(b.split("\n")[0] ?? "")) ?? "";
    expect(api).toMatch(/rm -rf \/usr\/local\/lib\/node_modules\/npm/);
    expect(api).toMatch(/\/usr\/local\/bin\/npx/);
    expect(api).not.toMatch(/^RUN npm /m);
  });
  it("nenhum workflow usa ação do Trivy por tag", () => {
    for (const w of ["ci.yml", "k8s.yml", "mutacao.yml"])
      expect(ler(`.github/workflows/${w}`)).not.toMatch(/aquasecurity\/(trivy|setup-trivy)-?action@|setup-trivy@/);
  });
  it("nginx manda os mesmos cabeçalhos de segurança do vercel.json", () => {
    const vercel = JSON.parse(ler("vercel.json")) as { headers: { source: string; headers: { key: string; value: string }[] }[] };
    const globais = vercel.headers.find((h) => h.source === "/(.*)")?.headers ?? [];
    const conf = ler("docker/nginx/seguranca.conf");
    expect(globais.length).toBeGreaterThan(3);
    /* única diferença aceita: o contêiner não recebe relatórios de CSP (a API dele é só GET/HEAD) */
    for (const { key, value } of globais) {
      if (key === "Reporting-Endpoints") continue;
      const semRelatorio = value.replace(/; report-uri \/api\/csp; report-to csp$/, "");
      expect(conf).toContain(`add_header ${key} "${semRelatorio}" always;`);
    }
    expect(conf).not.toMatch(/report-uri|report-to|Reporting-Endpoints/);
  });
  it("Vercel manda relatórios de CSP para /api/csp nos dois formatos", () => {
    const vercel = JSON.parse(ler("vercel.json")) as {
      headers: { source: string; headers: { key: string; value: string }[] }[];
      functions: Record<string, unknown>;
    };
    const globais = vercel.headers.find((h) => h.source === "/(.*)")?.headers ?? [];
    const csp = globais.find((h) => h.key === "Content-Security-Policy")?.value ?? "";
    expect(csp).toMatch(/; report-uri \/api\/csp; report-to csp$/);
    expect(globais.find((h) => h.key === "Reporting-Endpoints")?.value).toBe('csp="/api/csp"');
    expect(vercel.functions["api/csp.ts"]).toBeDefined();
  });
  it("toda location com add_header inclui os cabeçalhos de segurança", () => {
    const t = ler("docker/nginx/default.conf.template");
    const blocos = t.split(/\n\s*location /).slice(1);
    for (const b of blocos) {
      const corpo = b.slice(0, b.indexOf("\n    }"));
      if (/add_header|proxy_pass/.test(corpo)) expect(corpo).toContain("include /etc/nginx/snippets/seguranca.conf;");
    }
  });
  it("o template só usa a variável API_UPSTREAM do ambiente", () => {
    const vars = [...ler("docker/nginx/default.conf.template").matchAll(/\$\{([A-Z_]+)\}/g)].map((m) => m[1]);
    expect(new Set(vars)).toEqual(new Set(["API_UPSTREAM"]));
    expect(ler("Dockerfile")).toContain("NGINX_ENVSUBST_FILTER=API_UPSTREAM");
  });
});
