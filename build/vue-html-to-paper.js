(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.VueHtmlToPaper = {}));
}(this, function (exports) { 'use strict';

  function addStyles (win, styles) {
    styles.forEach(style => {
      let link = win.document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('type', 'text/css');
      link.setAttribute('href', style);
      win.document.getElementsByTagName('head')[0].appendChild(link);
    });
  }

  const options = {
    name: '_blank',
    specs: ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'].join(','),
    replace: true,
    styles: []
  };

  const setOptions = ({ name, specs, replace, styles }) => {
    specs = !!specs.length ? specs.join(',') : '';

    options.name = name || options.name;
    options.specs = specs || options.specs;
    options.replace = replace || options.replace;
    options.styles = styles || options.styles;
  };

  const htmlToPaper = (el, cb = () => true) => {
    const element = document.getElementById(el);

    if(!element) {
      alert(`Element to print #${el} not found!`);
      return;
    }

    const url = '';
    const win = window.open(url, options.name, options.specs, options.replace);

    win.document.write(`
    <html>
      <head>
        <title>${document.title}</title>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `);

    addStyles(win, options.styles);

    setTimeout(() => {
      win.document.close();
      win.focus();
      win.print();
      win.close();
      cb();
    }, 1000);
    return true;
  };

  const VueHtmlToPaper = {
    install(Vue, options = {}) {
      setOptions(options);

      Vue.mixin({
        methods: {
          $htmlToPaper: htmlToPaper
        }
      });
    }
  };

  exports.default = VueHtmlToPaper;
  exports.htmlToPaper = htmlToPaper;
  exports.setOptions = setOptions;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
