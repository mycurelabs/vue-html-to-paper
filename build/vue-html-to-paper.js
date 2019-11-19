(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.VueHtmlToPaper = factory());
}(this, function () { 'use strict';

  function addStyles (win, styles) {
    styles.forEach(style => {
      let link = win.document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('type', 'text/css');
      link.setAttribute('href', style);
      win.document.getElementsByTagName('head')[0].appendChild(link);
    });
  }

  const VueHtmlToPaper = {
    install (Vue, options = {}) {
      Vue.mixin({
        methods: {
          $htmlToPaper (el, cb) {
            let {
              name = '_blank',
              specs = ['fullscreen=yes','titlebar=yes', 'scrollbars=yes'],
              replace = true,
              styles = []
            } = options;
            specs = !!specs.length ? specs.join(',') : '';

            const element = document.getElementById(el);

            if(!element) {
              alert(`Element to print #${el} not found!`);
              return cb ? undefined : Promise.reject();
            }

            const url = '';
            const win = window.open(url, name, specs, replace);

            win.document.write(
              [
                `<html>`,
                `<head>`,
                `<title>${document.title}</title>`,
                `</head>`,
                `<body>${element.innerHTML}</body>`,
                `</html>`
              ].join("")
            );

            addStyles(win, styles);

            const promise = new Promise(resolve => {
              setTimeout(() => {
                win.document.close();
                win.focus();
                win.print();
                win.close();
                
                if (cb) cb();
                resolve();
              }, 1000);
            });

            return cb ? true : promise;
          }
        }
      });
    }
  };

  return VueHtmlToPaper;

}));
