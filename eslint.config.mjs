import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import react from 'eslint-plugin-react';

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { 
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
    },
    languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  
];
