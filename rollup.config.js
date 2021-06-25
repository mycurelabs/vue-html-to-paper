module.exports = {
  input: 'src/index.js',
  output: [
    {
      file: 'build/vue-html-to-paper.js',
      name: 'VueHtmlToPaper',
      format: 'umd',
    },
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named',
    },
  ],
};