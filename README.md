<img width="1280" height="304" alt="banner-vue-html-to-paper" src="https://github.com/user-attachments/assets/8a98b991-f362-4e6c-924f-bf42db08280a" />

# Vue HTML to Paper

Vue plugin for printing HTML elements. One package for **Vue 2.6, Vue 2.7 and Vue 3**, including **Nuxt 2, 3 and 4**.

![npm](https://img.shields.io/npm/dw/vue-html-to-paper)

[Demo](https://mycurelabs.github.io/vue-html-to-paper/) · [GitBook documentation](https://oss.mycure.md/v/vue-html-to-paper/) · [Changelog](CHANGELOG.md)

## How it works

`$htmlToPaper('printMe')` opens a new window and copies the **inner HTML** of `#printMe` into it. It then adds your stylesheets, calls `window.print()` and, by default, closes the window afterwards.

## Install

```sh
npm install vue-html-to-paper
```

## Setup

### Vue 3

```js
import { createApp } from 'vue';
import VueHtmlToPaper from 'vue-html-to-paper';
import App from './App.vue';

createApp(App)
  .use(VueHtmlToPaper, { styles: ['/print.css'] })
  .mount('#app');
```

### Vue 2 (2.6 and 2.7)

```js
import Vue from 'vue';
import VueHtmlToPaper from 'vue-html-to-paper';

Vue.use(VueHtmlToPaper, { styles: ['/print.css'] });
```

Before 2.1 you needed `vue-html-to-paper@1` for Vue 2. That's no longer necessary.

### Nuxt 3 / Nuxt 4

```ts
// app/plugins/html-to-paper.ts   (Nuxt 3: plugins/html-to-paper.ts)
import VueHtmlToPaper from 'vue-html-to-paper';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueHtmlToPaper, { styles: ['/print.css'] });
});
```

### Nuxt 2

```js
// plugins/html-to-paper.js, then add '~/plugins/html-to-paper.js' to `plugins` in nuxt.config.js
import Vue from 'vue';
import VueHtmlToPaper from 'vue-html-to-paper';

Vue.use(VueHtmlToPaper, { styles: ['/print.css'] });
```

Installing the plugin never touches `window`, so it can run during SSR. You don't need a `.client` plugin or `ssr: false`.

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-html-to-paper/build/vue-html-to-paper.min.js"></script>
<script>
  Vue.createApp({ /* ... */ }).use(VueHtmlToPaper, { styles: ['/print.css'] }).mount('#app');
  // Vue 2: Vue.use(VueHtmlToPaper, { styles: ['/print.css'] });
</script>
```

The global `VueHtmlToPaper` also exposes `VueHtmlToPaper.useHtmlToPaper` and `VueHtmlToPaper.htmlToPaper`.

## Usage

### Options API (Vue 2 and 3)

```vue
<template>
  <div>
    <div id="printMe" ref="invoice">
      <h1>Invoice #42</h1>
    </div>
    <button @click="print">Print</button>
  </div>
</template>

<script>
export default {
  methods: {
    async print () {
      await this.$htmlToPaper('printMe');
      // or: this.$htmlToPaper(this.$refs.invoice)
      // or: this.$htmlToPaper('printMe', { autoClose: false }, () => console.log('printed'))
    },
  },
};
</script>
```

### Composition API (Vue 2.7 and 3)

```vue
<template>
  <div ref="invoice"><h1>Invoice #42</h1></div>
  <button @click="printInvoice">Print</button>
</template>

<script setup>
import { ref } from 'vue';
import { useHtmlToPaper } from 'vue-html-to-paper';

const print = useHtmlToPaper(); // uses the options you passed to app.use()
const invoice = ref(null);

const printInvoice = async () => {
  const printed = await print(invoice.value, { windowTitle: 'invoice-42' });
};
</script>
```

In Vue 3 the same function is also provided as `inject('htmlToPaper')`. To print without installing the plugin, `import { htmlToPaper } from 'vue-html-to-paper'`. It uses the default options.

### Signature

```ts
$htmlToPaper(el, localOptions?, callback?): Promise<boolean>
```

- `el`: an element id, an `HTMLElement`, or a component instance (its `$el` is printed).
- `localOptions`: overrides the global options for this call only.
- `callback`: runs after `print()`.
- **Returns** a Promise. It resolves to `true` after printing (and after the callback has run). It resolves to `false` if the element wasn't found or the pop-up was blocked.

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | `'_blank'` | `window.open()` target name. |
| `specs` | `string[]` | `['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes']` | [Window features](https://developer.mozilla.org/docs/Web/API/Window/open#windowfeatures), joined with commas. |
| `styles` | `string[]` | `[]` | Stylesheet URLs added to the print window as `<link rel="stylesheet">`. |
| `autoClose` | `boolean` | `true` | Close the print window after printing. |
| `timeout` | `number` | `1000` | Milliseconds to wait (so stylesheets can load) before calling `print()`. |
| `windowTitle` | `string` | `document.title` | Title of the print window. Browsers use it as the default PDF file name. |

Pass global options to `app.use()` / `Vue.use()`. Local options override them key by key; any key you set (other than `undefined`) wins.

## Tips

- **Only the element's inner HTML is printed.** The element itself, with its id and classes, is not copied. Write print CSS that targets the content (`h1`, `.total`, …), not the wrapper (`#printMe h1`).
- **Style URLs** must resolve from the print window. Use absolute or root-relative paths (`/print.css`) to files your app serves, such as Vite's `public/`, Nuxt's `public/` (Nuxt 2: `static/`) or a CDN.
- **Landscape:** add a stylesheet that contains `@media print { @page { size: landscape; } }`.
- **Pop-up blockers:** call `$htmlToPaper` directly from a user action, such as a click handler.

## TypeScript

Types are included. `this.$htmlToPaper` and `$htmlToPaper` in templates are typed for Vue 3 and for Vue 2.7 `defineComponent` / `<script setup>`. If you use the classic `Vue.extend()` API on Vue 2, add this shim:

```ts
// shims-html-to-paper.d.ts
import type { HtmlToPaper } from 'vue-html-to-paper';

declare module 'vue/types/vue' {
  interface Vue {
    $htmlToPaper: HtmlToPaper
  }
}
```

## Development

```sh
npm install
npm test               # Vitest + jsdom on Vue 3.5, 2.7 and 2.6
npm run test:types     # tsc against Vue 3 and Vue 2.7 types
npm run build          # Rollup: dist/ (ESM + CJS), build/ (UMD), types/index.d.mts
npm run test:smoke     # load the built ESM/CJS/UMD bundles
npm run test:package   # @arethetypeswrong/cli
npm run lint
```

`index.html` is the demo page. It loads `build/vue-html-to-paper.js`, so run `npm run build` first and serve the repo root with any static server.

Made with ❤️ by [Joff Tiquez](https://twitter.com/jrtiquez)
