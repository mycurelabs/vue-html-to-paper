(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.VueHtmlToPaper = factory());
}(this, (function () { 'use strict';

  const addStyles = (win, styles) => {
    styles.forEach((style) => {
      let link = win.document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('type', 'text/css');
      link.setAttribute('href', style);
      win.document.getElementsByTagName('head')[0].appendChild(link);
    });
  };

  const VueHtmlToPaper = {
    install (Vue, options = {}) {
      Vue.prototype.$htmlToPaper = (el, localOptions = {}, cb = () => true) => {
        let defaultName = '_blank', 
          defaultSpecs = ['fullscreen=yes','titlebar=yes', 'scrollbars=yes'],
          defaultStyles = [],
          defaultTimeout = 1000,
          defaultAutoClose = true,
          defaultWindowTitle = window.document.title;
        let {
          name = defaultName,
          specs = defaultSpecs,
          styles = defaultStyles,
          timeout = defaultTimeout,
          autoClose = defaultAutoClose,
          windowTitle = defaultWindowTitle,
        } = options;
        
        if (localOptions.name) name = localOptions.name;
        if (localOptions.specs) specs = localOptions.specs;
        if (localOptions.styles) styles = localOptions.styles;
        if (localOptions.timeout) timeout = localOptions.timeout;
        if (localOptions.autoClose) autoClose = localOptions.autoClose;
        if (localOptions.windowTitle) windowTitle = localOptions.windowTitle;

        specs = !!specs.length ? specs.join(',') : '';

        let element = el;
        if (typeof el === 'string' || el instanceof String) {
          element = window.document.getElementById(el);
        }
        if (!element) {
          alert(`Element to print #${el} not found!`);
          return;
        }

        const url = '';
        const win = window.open(url, name, specs);

        win.document.write(`
        <html>
          <head>
            <title>${windowTitle}</title>
          </head>
          <body>
            ${element.innerHTML}
          </body>
        </html>
      `);

        addStyles(win, styles);

        const promise = new Promise((resolve) => {
          setTimeout(() => {
            win.focus();
            win.print();
            autoClose && win.document.close();
            autoClose && win.close();
            if (cb) cb();
            resolve();
          }, timeout);
        });

        return cb ? true : promise;
      };
    },
  };

  return VueHtmlToPaper;

})));
