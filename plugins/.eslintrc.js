const path = require('path');
module.exports = {
  plugins: ['header'],
  rules: {
    'header/header': ['error', path.join(__dirname, '../config/copyright.txt')]
  },
  overrides: [{ files: ['*.md', '*.json'], rules: { 'header/header': 'off' } }]
};
