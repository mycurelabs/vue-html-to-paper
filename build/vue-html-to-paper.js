(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VueHtmlToPaper = {}));
})(this, (function (exports) { 'use strict';

  function addStyles (win, styles) {
    styles.forEach((style) => {
      let link = win.document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('type', 'text/css');
      link.setAttribute('href', style);
      win.document.getElementsByTagName('head')[0].appendChild(link);
    });
  }

  function openWindow (url, name, props) {
    let windowRef = null;
    windowRef = window.open(url, name, props);
    if (!windowRef.opener) {
      windowRef.opener = self;
    }
    windowRef.focus();
    return windowRef;
  }

  let defaultOptions = {
    name: '_blank',
    specs: ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
    replace: true,
    styles: [],
    autoClose: true,
    windowTitle: null,
  };

  const useHtmlToPaper = (el, localOptions = {}, cb = () => true) => {
    const {
      name,
      specs,
      replace,
      styles,
      autoClose,
      windowTitle,
    } = {
      ...defaultOptions,
      ...localOptions,
    };

    const formattedSpecs = !!specs.length ? specs.join(',') : '';

    const element = window.document.getElementById(el);

    if (!element) {
      alert(`Element to print #${el} not found!`);
      return;
    }

    const url = '';
    const win = openWindow(url, name, formattedSpecs);

    win.document.write(`
    <html>
      <head>
        <title>${windowTitle || window.document.title}</title>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `);

    addStyles(win, styles);

    setTimeout(() => {
      win.focus();
      win.print();
      console.warn('autoClose', autoClose);
      if (autoClose) {
        setTimeout(function () {
          win.close();
        }, 1);
      }
      cb();
    }, 1000);

    return true;
  };

  const VueHtmlToPaper = {
    install (app, options = {}) {
      defaultOptions = {
        ...defaultOptions,
        ...options,
      };

      if (app.prototype) {
        app.prototype.$htmlToPaper = useHtmlToPaper;
      } else {
        app.provide('htmlToPaper', useHtmlToPaper);

        app.config.globalProperties.$htmlToPaper = useHtmlToPaper;
      }
    },
  };

  exports.VueHtmlToPaper = VueHtmlToPaper;
  exports.useHtmlToPaper = useHtmlToPaper;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
