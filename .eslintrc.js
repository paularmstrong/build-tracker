module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module'
  },
  extends: ['prettier', 'prettier/@typescript-eslint', 'plugin:react/recommended', 'plugin:jest/recommended'],
  plugins: ['@typescript-eslint', 'markdown', 'json', 'prettier', 'react', 'jest'],
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
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'no-console': 'error',
    quotes: 'off',

    'prettier/prettier': ['error', { singleQuote: true, printWidth: 120 }],

    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/array-type': ['error', 'generic'],
    '@typescript-eslint/ban-types': 'error',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/class-name-casing': 'error',
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
    '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/interface-name-prefix': 'error',
    '@typescript-eslint/member-delimiter-style': 'error',
    '@typescript-eslint/no-angle-bracket-type-assertion': 'error',
    '@typescript-eslint/no-array-constructor': 'error',
    '@typescript-eslint/no-empty-interface': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-object-literal-type-assertion': 'error',
    '@typescript-eslint/no-parameter-properties': 'error',
    '@typescript-eslint/no-triple-slash-reference': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/prefer-interface': 'error',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/type-annotation-spacing': 'error',

    'jest/consistent-test-it': ['error', { fn: 'test' }],
    'jest/no-large-snapshots': ['error', { maxSize: 0 }],
    'jest/no-test-prefixes': 'error',
    'jest/valid-describe': 'error',
    'jest/valid-expect-in-promise': 'error',

    'react/display-name': 'off',
    'react/no-find-dom-node': 'warn',
    'react/react-in-jsx-scope': 'off'
  }
};
