const tseslint = require('typescript-eslint');
const baseConfig = require('../../eslint.config.js');

// Import the actual plugin objects
const reactPlugin = require('eslint-plugin-react');
// Use the modern JSX runtime configuration instead of 'recommended'
const jsxRuntimeConfig = require('eslint-plugin-react/configs/jsx-runtime');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const reactRefreshPlugin = require('eslint-plugin-react-refresh');

module.exports = tseslint.config(
  ...baseConfig,
  {
    files: ['src/**/*.{ts,tsx}'],
    // Apply the modern JSX runtime configuration
    ...jsxRuntimeConfig,
    // Explicitly define the plugins
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      // The jsxRuntimeConfig already handles turning off 'react-in-jsx-scope'.
      // We just need to add our other specific rules.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    ignores: ['dist/'],
  }
);
