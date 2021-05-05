module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  // add your custom rules here
  rules: {
    'semi': [2, 'always'],
    'space-before-function-paren': [2, 'always'],
    'keyword-spacing': [2, { before: true, after: true }],
    'space-before-blocks': [2, 'always'],
    'comma-dangle': [2, 'always-multiline'],
    'no-console': 'off',
    'no-multi-str': 'off',
    'arrow-body-style': [2],
  },
};
