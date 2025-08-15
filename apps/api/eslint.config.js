const tseslint = require('typescript-eslint');
const baseConfig = require('../../eslint.config.js'); // Import from root

module.exports = tseslint.config(...baseConfig, {
  // Add api-specific settings here
  ignores: ['dist/'],
});
