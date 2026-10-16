import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Vue27 from 'vue2';
import Vue26 from 'vue26';
import VueHtmlToPaper from '../src/index.js';
import { mockPopup, mountTarget } from './popup.js';

for (const Vue of [Vue27, Vue26]) {
  Vue.config.productionTip = false;
  Vue.config.devtools = false;
}

// Vue.use() installs a plugin once per constructor, so each test gets a fresh
// subclass with its own prototype.
const install = (Vue, options) => {
  const Local = Vue.extend();
  Local.use = Vue.use;
  Local.use(VueHtmlToPaper, options);
  return new Local({ render: (h) => h('span') }).$mount();
};

describe.each([['2.7', Vue27], ['2.6', Vue26]])('Vue %s: Vue.use(VueHtmlToPaper)', (version, Vue) => {
  let popup, open;

  beforeEach(() => {
    vi.useFakeTimers();
    ({ popup, open } = mockPopup());
    mountTarget();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it(`runs on Vue ${version}`, () => {
    expect(Vue.version.startsWith(`${version}.`)).toBe(true);
  });

  it('registers this.$htmlToPaper on Vue 2 components', () => {
    const vm = install(Vue, { styles: ['a.css'] });
    vm.$htmlToPaper('printMe');
    vi.runAllTimers();
    expect(open).toHaveBeenCalledWith('', '_blank', 'fullscreen=yes,titlebar=yes,scrollbars=yes');
    expect(popup.document.body.innerHTML).toContain('<h1>Invoice #42</h1>');
    expect(popup.styles()).toEqual(['a.css']);
    expect(popup.print).toHaveBeenCalledOnce();
    expect(popup.close).toHaveBeenCalledOnce();
  });

  it('is available in methods of a component', () => {
    const Local = Vue.extend();
    Local.use = Vue.use;
    Local.use(VueHtmlToPaper);
    const vm = new Local({ methods: { print () { this.$htmlToPaper('printMe', { autoClose: false }); } }, render: (h) => h('span') }).$mount();
    vm.print();
    vi.runAllTimers();
    expect(popup.print).toHaveBeenCalledOnce();
    expect(popup.close).not.toHaveBeenCalled();
  });

  it('works with the global Vue.use() + new Vue()', () => {
    Vue.use(VueHtmlToPaper);
    new Vue({ render: (h) => h('span') }).$mount().$htmlToPaper('printMe');
    vi.runAllTimers();
    expect(popup.print).toHaveBeenCalledOnce();
  });

  it('does not touch Vue 3-only APIs', () => {
    expect(Vue.config.globalProperties).toBeUndefined();
    expect(() => install(Vue)).not.toThrow();
  });
});
