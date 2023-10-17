# Vue HTML to Paper

Vue plugin for printing html elements.

![npm](https://img.shields.io/npm/dw/vue-html-to-paper)


[Demo](https://mycurelabs.github.io/vue-html-to-paper/)

[GitBook Documentation](https://oss.mycure.md/v/vue-html-to-paper/)

## Install

```sh
npm install vue-html-to-paper
yarn add vue-html-to-paper
```

## Development Setup

```
npm install

npm run build:all
```

## Usage

### Vue 3, Vue 2
- initialize in `main.ts|js` (optional)
- use in component:
```js
<template>
  <div>
    <div id="printMe">
      <h1>Print me!</h1>
    </div>
    <button @click="print">Print</button>
  </div>
<template>

// options API
<script>
import { useHtmlToPaper } from "vue-html-to-paper";

export default {
  name: 'Component',
  methods: {
    print() {
      useHtmlToPaper('printMe')
    }
  }
}
</script>

// composition API
<script setup>
import { useHtmlToPaper } from "vue-html-to-paper";

const print = () => {
  useHtmlToPaper("printMe");
};
</script>

```

### Vue 3

```js
// main.js | ts
import { createApp } from "vue";
import App from "./App.vue";

import { VueHtmlToPaper } from "vue-html-to-paper";

const app = createApp(App);

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ],
  timeout: 1000, // default timeout before the print window appears
  autoClose: true, // if false, the window will not close after printing
  windowTitle: window.document.title, // override the window title
}

app.use(VueHtmlToPaper, options);

// or, using the defaults with no stylesheet
app.use(VueHtmlToPaper);

app.mount("#app");
```

**Options API**
```js
// Component.vue
<template>
  <div>
    <div id="printMe">
      <h1>Print me!</h1>
    </div>
    <button @click="print">Print</button>
  </div>
<template>

<script>
import { defineComponent } from "vue";

export default defineComponent {
  methods: {
    print () {
      // Pass the element id here
      this.$.appContext.config.globalProperties.$htmlToPaper('printMe');
    }
  }
}
</script>
```

**Composition API**
```js
// Component.vue
<template>
  <div>
    <div id="printMe">
      <h1>Print me!</h1>
    </div>
    <button @click="print">Print</button>
  </div>
<template>

<script setup>
import { inject } from "vue";

const htmlToPaper = inject("htmlToPaper")

const print = () => {
  htmlToPaper("printMe");
};
</script>
```

**Composition API + TypeScript**
```js
// Component.vue
<template>
  <div>
    <div id="printMe">
      <h1>Print me!</h1>
    </div>
    <button @click="print">Print</button>
  </div>
<template>

<script lang="ts" setup>
import { inject } from "vue";
import { HtmlToPaper } from "vue-html-to-paper";

const htmlToPaper = inject("htmlToPaper") as HtmlToPaper;

const print = () => {
  htmlToPaper("printMe");
};
</script>
```

### Vue 2

```js
// main.js
import Vue from 'vue'
import App from './App.vue'
import {VueHtmlToPaper} from 'vue-html-to-paper';

Vue.config.productionTip = false

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ],
  timeout: 1000, // default timeout before the print window appears
  autoClose: true, // if false, the window will not close after printing
  windowTitle: window.document.title, // override the window title
}

Vue.use(VueHtmlToPaper, options);

// or, using the defaults with no stylesheet
Vue.use(VueHtmlToPaper);

new Vue({
  render: h => h(App),
}).$mount('#app')
```

```js
// Component.vue
<template>
  <div>
    <div id="printMe">
      <h1>Print me!</h1>
    </div>
    <button @click="print">Print</button>
  </div>
<template>

<script>
export default {
  name: 'Component',
  methods: {
    print() {
      this.$htmlToPaper('printMe')
    }
  }
}
</script>
```

Made with ❤️ by [Joff Tiquez](https://twitter.com/jrtiquez)
