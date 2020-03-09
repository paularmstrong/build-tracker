const path = require('path');
module.exports = {
  plugins: ['header'],
  overrides: [
    {
      files: ['*.md'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-unused-vars': 'off'
      }
    }
  ]
};
