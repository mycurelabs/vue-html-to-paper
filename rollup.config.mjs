import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'src/index.js',
    output: [
      { file: 'dist/index.mjs', format: 'es' },
      { file: 'dist/index.js', format: 'cjs', exports: 'named' },
    ],
  },
  {
    input: 'src/umd.js',
    output: [
      { file: 'build/vue-html-to-paper.js', name: 'VueHtmlToPaper', format: 'umd', exports: 'default' },
      { file: 'build/vue-html-to-paper.min.js', name: 'VueHtmlToPaper', format: 'umd', exports: 'default', plugins: [terser()] },
    ],
  },
];
