# Changelog

## Unreleased

### Added
- **One package for Vue 2.6, Vue 2.7 and Vue 3.** `install()` detects `app.use()` versus `Vue.use()`. The peer dependency is now `vue: ^2.6.0 || ^3.0.0`.
- Composition API: `useHtmlToPaper()` (in Vue 2.7 and Vue 3 `setup()`), the standalone `htmlToPaper()`, and `inject('htmlToPaper')` on Vue 3.
- `$htmlToPaper` accepts an `HTMLElement` or a component instance (template refs), not only an element id.
- `timeout` option: delay before `print()`. Default `1000` ms, the same as the previous fixed delay.
- An ES module build (`dist/index.mjs`), an `exports` map, a minified UMD build (`build/vue-html-to-paper.min.js`), and `unpkg`/`jsdelivr` fields.

### Fixed
- The print dialog never opened in Chrome (the popup spun forever or closed at once) because the popup document was never closed (mycurelabs/vue-html-to-paper#126).
- Installing on Vue 2 threw `Cannot set properties of undefined (setting '$htmlToPaper')` (mycurelabs/vue-html-to-paper#66).
- The TypeScript declarations had no default export, so `app.use(VueHtmlToPaper)` failed to type-check. The callback signature and return type also didn't match the runtime. The ESM types resolved as CommonJS.
- A local `autoClose: true` could not override a global `autoClose: false`.
- `windowTitle` is now HTML-escaped.
- A blocked pop-up now resolves to `false` and logs an error instead of throwing.
- Removed a leftover `console.warn` that ran on every print.

### Changed
- `$htmlToPaper()` returns a `Promise<boolean>` instead of returning `true` synchronously. The Promise is still truthy, and the callback argument still works.
- The print window is written with `<!DOCTYPE html>`, so it renders in standards mode instead of quirks mode.
- The `exports` map limits deep imports to `dist/*`, `build/*` and `package.json`.
- The published package now also contains `build/` (the UMD bundles).
- The `replace` option is deprecated. It was always ignored.

### Tooling
- Node 24 (`.nvmrc`). Rollup 4 is now the only bundler, replacing webpack 5 + Babel. ESLint 10 (flat config). Vitest 5 + jsdom tests on Vue 3.5, 2.7 and 2.6. TypeScript 7 type tests. arethetypeswrong. GitHub Actions CI. npm replaces yarn.
