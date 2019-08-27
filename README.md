# vue-html-to-paper
Vue mixin for paper printing html elements.

### Demo

https://mycurelabs.github.io/vue-html-to-paper/

### Install

**NPM**
```
npm install vue-html-to-paper
```
**Yarn**
```
yarn add vue-html-to-paper
```
**CDN**
```
https://unpkg.com/vue-html-to-paper/build/vue-html-to-paper.js
```

### Usage

**main.js**

```javascript
import Vue from 'vue';
import VueHtmlToPaper from 'vue-html-to-paper';

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
  ]
}

Vue.use(VueHtmlToPaper, options);

// or, using the defaults with no stylesheet

Vue.use(VueHtmlToPaper);
```

See `window.open` API [here](https://www.w3schools.com/Jsref/met_win_open.asp).

**component**

```html
<template>
  <div>
    <!-- SOURCE -->
    <div id="printMe">
      <h1>Print me!</h1>
    </div>
    <!-- OUTPUT -->
    <button @click="print"></button>
  </div>
<template>

<script>
export default {
  data() {
    return {
      output: null
    }
  },
  methods: {
    print() {
      // Pass the element id here
      this.$htmlToPaper('printMe');
    }
  }
}
</script>
```

### Callback

Use the callback function to be notified when printing has been completed (whether or not it was successful). The callback method is not required.

```js
this.$htmlToPaper('printMe', () => {
  console.log('Printing completed or was cancelled!');
});
```

Made with ❤️ by Jofferson Ramirez Tiquez
