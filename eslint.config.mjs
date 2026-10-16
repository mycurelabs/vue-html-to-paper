import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';

export default [
  { ignores: ['dist/', 'build/', 'node_modules/'] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { '@stylistic': stylistic },
    rules: {
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/space-before-function-paren': ['error', 'always'],
      '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
      '@stylistic/space-before-blocks': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      'arrow-body-style': 'error',
      'no-console': 'off',
      'no-multi-str': 'off',
    },
  },
  {
    // The published bundles are not transpiled. Keep the source parseable by
    // webpack 4 (Nuxt 2 / Vue CLI 4), which has no optional chaining or `??`.
    files: ['src/**/*.js'],
    languageOptions: { ecmaVersion: 2018 },
  },
];
