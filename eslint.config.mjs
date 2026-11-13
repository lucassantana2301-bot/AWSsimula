import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "build/**",
      "build-api/**",
      "node_modules/**",
      "src/legacy/**",
      "scripts/migrate/**",
      "tests/browser/**",
      "tests/test-*.js",
      "coverage/**",
      "reports/**",
      "playwright-report/**",
      "test-results/**",
      ".stryker-tmp/**",
      ".vercel/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    files: ["src/**/*.ts", "api/**/*.ts", "server/**/*.ts", "tests/unit/**/*.ts", "tests/e2e/**/*.ts", "*.config.ts"],
    languageOptions: {
      parserOptions: { project: "./tsconfig.json", tsconfigRootDir: import.meta.dirname },
      globals: { ...globals.browser },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
      eqeqeq: ["error", "always"],
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
  {
    /* servidor da API em contêiner: ambiente Node e log estruturado em stdout */
    files: ["server/**/*.ts"],
    languageOptions: { globals: { ...globals.node } },
    rules: { "no-console": "off" },
  },
  {
    /* modelo do service worker: JS puro, escopo de worker; __ARQUIVOS__ vira a lista no build */
    files: ["src/pwa/*.js"],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      ...tseslint.configs.disableTypeChecked.languageOptions,
      sourceType: "script",
      globals: { ...globals.serviceworker, __ARQUIVOS__: "readonly" },
    },
    rules: { ...tseslint.configs.disableTypeChecked.rules, eqeqeq: ["error", "always"] },
  },
  {
    files: ["scripts/**/*.mjs", "eslint.config.mjs"],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: { ...tseslint.configs.disableTypeChecked.languageOptions, globals: { ...globals.node } },
  },
);
