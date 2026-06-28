import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([

  {
    ignores: [
      "node_modules/**",
      "coverage/**"
    ]
  },

  {
    files: ["**/*.js"],

    extends: [js.configs.recommended],

    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: "latest",
      globals: globals.node
    },

    rules: {

      "no-unused-vars": "warn",

      "no-console": "off",

      "semi": ["error", "always"],

      "quotes": ["error", "double"]

      }
  },

  {
    files: ["tests/**/*.js"],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      }
    }
  }

]);