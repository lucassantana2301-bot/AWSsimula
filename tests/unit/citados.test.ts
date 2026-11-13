import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { chavesDe, montarIndice, servicosCitados, type EntradaIndice } from "../../src/features/guia/citados";

const raiz = join(__dirname, "..", "..", "content");
const ler = (rel: string): EntradaIndice[] => JSON.parse(readFileSync(join(raiz, rel), "utf8")) as EntradaIndice[];
const indiceJson = ler("guia/indice.json");
const servicos = ler("guia/servicos.json");
const indice = montarIndice(indiceJson);
const cita = (...t: string[]) => servicosCitados(t, indice);

describe("serviços citados numa questão", () => {
  it("indice.json bate com o guia (id e nome)", () => {
    expect(indiceJson).toEqual(servicos.map((s) => ({ id: s.id, nome: s.nome })));
  });

  it("acha o serviço pelo nome curto e pelo completo", () => {
    expect(cita("Use o S3 com versionamento.")).toEqual(["s3"]);
    expect(cita("O Amazon EFS é compartilhado; o EBS é de uma instância.")).toEqual(["efs", "ebs"]);
  });

  it("o trecho mais longo vence", () => {
    expect(cita("Mova para S3 Glacier depois de 90 dias.")).toEqual(["s3-glacier"]);
    expect(cita("EC2 Auto Scaling ajusta a frota.")).toEqual(["ec2-auto-scaling"]);
  });

  it("siglas entre parênteses contam", () => {
    expect(cita("Coloque um ALB na frente.")).toEqual(["elb"]);
  });

  it("não confunde palavra comum em português com serviço", () => {
    expect(cita("Revise a configuração e faça backup em batch.")).toEqual([]);
    expect(cita("Use o AWS Config para auditar.")).toEqual(["config"]);
    expect(chavesDe("AWS Glue")).toEqual(["AWS Glue"]);
  });

  it("prioriza a ordem dos textos e limita a 3", () => {
    expect(cita("Lambda resolve.", "Compare com EC2, ECS, EKS e Fargate.")).toEqual(["lambda", "ec2", "ecs"]);
  });

  it("cada serviço do guia é achável pelo próprio nome", () => {
    const perdidos = servicos.filter((s) => !cita(`texto com ${s.nome} no meio`).includes(s.id)).map((s) => s.id);
    expect(perdidos).toEqual([]);
  });
});
