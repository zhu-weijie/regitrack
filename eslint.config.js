const tseslint = require('typescript-eslint');
const prettierConfig = require('eslint-plugin-prettier/recommended');

// This is the base configuration that other configs will extend
module.exports = tseslint.config(
  require('@eslint/js').configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig
);
