import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import { dirname } from "path";
import parser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: true,
});

export default [
  // 1. Definição de pastas ignoradas (substitui o .eslintignore)
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**", "eslint.config.js"]
  },
  
  // 2. Extensões recomendadas
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ),

  // 3. Configurações de parser e regras para arquivos TypeScript
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Permitido para flexibilidade em mocks de teste
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" }, // Ignora variáveis que começam com _ (ex: _next)
      ],
    },
  },
];