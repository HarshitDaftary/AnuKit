module.exports = {
  root: false,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  settings: {
    react: { version: 'detect' }
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  rules: {}
};
