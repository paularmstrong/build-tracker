const path = require('path');
module.exports = {
  plugins: ['header'],
  rules: {
    'header/header': ['error', path.join(__dirname, '../config/copyright.txt')]
  },
  overrides: [{ files: '*.md', rules: { 'header/header': 'off' } }]
};
