module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module'
  },
  extends: ['prettier', 'prettier/@typescript-eslint', 'plugin:react/recommended', 'plugin:jest/recommended'],
  plugins: ['@typescript-eslint', 'markdown', 'json', 'prettier', 'react', 'react-hooks', 'jest'],
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
    'sort-imports': ['error', { memberSyntaxSortOrder: ['none', 'all', 'single', 'multiple'], ignoreCase: true }],
    quotes: 'off',

    'prettier/prettier': ['error', { singleQuote: true, printWidth: 120 }],

    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/array-type': ['error', { default: 'generic' }],
    '@typescript-eslint/ban-types': 'error',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/class-name-casing': 'error',
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
    '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/interface-name-prefix': 'error',
    '@typescript-eslint/member-delimiter-style': 'error',
    '@typescript-eslint/no-array-constructor': 'error',
    '@typescript-eslint/no-empty-interface': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-parameter-properties': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/triple-slash-reference': 'error',
    '@typescript-eslint/type-annotation-spacing': 'error',

    'jest/consistent-test-it': ['error', { fn: 'test' }],
    'jest/no-large-snapshots': ['error', { maxSize: 0 }],
    'jest/no-test-prefixes': 'error',
    'jest/valid-describe': 'error',
    'jest/valid-expect-in-promise': 'error',

    'react/display-name': 'off',
    'react/no-find-dom-node': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error'
  },
  overrides: [{ files: ['*.js'], rules: { '@typescript-eslint/explicit-function-return-type': 'off' } }]
};
