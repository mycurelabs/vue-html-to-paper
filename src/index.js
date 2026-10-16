const DEFAULT_OPTIONS = {
  name: '_blank',
  specs: ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
  styles: [],
  autoClose: true,
  timeout: 1000,
  windowTitle: undefined,
};

// Later sources win, but only for keys they actually define.
function mergeOptions (...sources) {
  const merged = {};
  sources.forEach((source) => {
    Object.keys(source || {}).forEach((key) => {
      if (source[key] !== undefined) merged[key] = source[key];
    });
  });
  return merged;
}

function escapeHtml (text) {
  return String(text).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function addStyles (win, styles) {
  styles.forEach((style) => {
    const link = win.document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', style);
    win.document.getElementsByTagName('head')[0].appendChild(link);
  });
}

function openWindow (url, name, props) {
  const windowRef = window.open(url, name, props);
  if (!windowRef) return null;
  if (!windowRef.opener) {
    windowRef.opener = self;
  }
  windowRef.focus();
  return windowRef;
}

function resolveElement (el) {
  if (typeof el === 'string') return window.document.getElementById(el);
  // A component instance (Vue 2/3 template ref on a component) or an element.
  return (el && el.$el) || el || null;
}

// Returns a print function bound to `globalOptions`. Each call resolves to
// true once printed (after `cb` ran), or false if nothing could be printed.
function createHtmlToPaper (globalOptions = {}) {
  return (el, localOptions, cb = () => true) => new Promise((resolve) => {
    const {
      name,
      specs,
      styles,
      autoClose,
      timeout,
      windowTitle,
    } = mergeOptions(DEFAULT_OPTIONS, globalOptions, localOptions);

    const element = resolveElement(el);

    if (!element) {
      alert(typeof el === 'string' ? `Element to print #${el} not found!` : 'Element to print not found!');
      resolve(false);
      return;
    }

    const win = openWindow('', name, specs.length ? specs.join(',') : '');

    if (!win) {
      console.error('[vue-html-to-paper] window.open() was blocked; allow pop-ups for this site to print.');
      resolve(false);
      return;
    }

    win.document.write(`<!DOCTYPE html>
      <html>
        <head>
          <title>${escapeHtml(windowTitle || window.document.title)}</title>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);

    addStyles(win, styles);

    // Without this Chrome treats the popup as still loading and never
    // opens the print dialog (mycurelabs/vue-html-to-paper#126).
    win.document.close();

    setTimeout(() => {
      win.focus();
      win.print();
      if (autoClose) {
        setTimeout(() => win.close(), 1);
      }
      cb();
      resolve(true);
    }, timeout);
  });
}

// Print function from the most recent install(); defaults until then.
let installedHtmlToPaper = createHtmlToPaper();

// Standalone print function using only the default options.
export const htmlToPaper = createHtmlToPaper();

// Composition API access (Vue 2.7 / Vue 3 setup()) to the print function
// configured by app.use(VueHtmlToPaper, options) / Vue.use(...).
export function useHtmlToPaper () {
  return installedHtmlToPaper;
}

const VueHtmlToPaper = {
  // `app` is a Vue 3 app (app.use) or the Vue 2 constructor (Vue.use).
  install (app, options = {}) {
    const print = createHtmlToPaper(options);
    installedHtmlToPaper = print;

    if (app.config && app.config.globalProperties) {
      app.config.globalProperties.$htmlToPaper = print;
      app.provide('htmlToPaper', print);
    } else {
      app.prototype.$htmlToPaper = print;
    }
  },
};

export { VueHtmlToPaper };
export default VueHtmlToPaper;
