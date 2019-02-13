module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: [
    'prettier'
  ],
  plugins: ['markdown', 'json', 'prettier'],
  env: {
    es6: true,
    node: true,
    browser: true
  },
  globals: {
    document: false,
    navigator: false,
    window: false
  },
  rules: {
    'no-console': 'error',
    quotes: 'off',

    'prettier/prettier': ['error', { singleQuote: true, printWidth: 120 }]
  }
};
