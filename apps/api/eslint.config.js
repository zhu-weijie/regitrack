const tseslint = require('typescript-eslint');
const prettierConfig = require('eslint-plugin-prettier/recommended');

module.exports = tseslint.config(
  require('@eslint/js').configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    ignores: ['dist/'],
  }
);
