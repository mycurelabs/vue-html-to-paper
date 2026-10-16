import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp, defineComponent, h, inject } from 'vue';
import Vue2 from 'vue2';
import VueHtmlToPaper, { VueHtmlToPaper as Named, htmlToPaper, useHtmlToPaper } from '../src/index.js';
import { mockPopup, mountTarget } from './popup.js';

Vue2.config.productionTip = false;
Vue2.config.devtools = false;

describe('public API', () => {
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

  it('exports the plugin as default and as VueHtmlToPaper', () => {
    expect(Named).toBe(VueHtmlToPaper);
    expect(typeof VueHtmlToPaper.install).toBe('function');
  });

  describe('target element', () => {
    it('accepts an HTMLElement', () => {
      const el = mountTarget('other', '<p>Direct element</p>');
      htmlToPaper(el);
      expect(popup.document.body.innerHTML).toContain('Direct element');
    });

    it('accepts a component instance (uses its $el)', () => {
      const el = mountTarget('cmp', '<p>Component root</p>');
      htmlToPaper({ $el: el });
      expect(popup.document.body.innerHTML).toContain('Component root');
    });
  });

  describe('return value', () => {
    it('resolves to true after printing and running the callback', async () => {
      const order = [];
      popup.print.mockImplementation(() => order.push('print'));
      const result = htmlToPaper('printMe', null, () => order.push('callback'));
      expect(result).toBeInstanceOf(Promise);
      await vi.runAllTimersAsync();
      await expect(result).resolves.toBe(true);
      expect(order).toEqual(['print', 'callback']);
    });

    it('resolves to false when the element does not exist', async () => {
      vi.spyOn(window, 'alert').mockImplementation(() => {});
      await expect(htmlToPaper('missing')).resolves.toBe(false);
      await expect(htmlToPaper(null)).resolves.toBe(false);
      expect(open).not.toHaveBeenCalled();
    });

    it('resolves to false when the popup is blocked', async () => {
      open.mockReturnValue(null);
      vi.spyOn(console, 'error').mockImplementation(() => {});
      await expect(htmlToPaper('printMe')).resolves.toBe(false);
    });
  });

  describe('htmlToPaper() standalone', () => {
    it('prints with the default options without installing the plugin', async () => {
      const done = htmlToPaper('printMe', { styles: ['x.css'] });
      await vi.runAllTimersAsync();
      await done;
      expect(open).toHaveBeenCalledWith('', '_blank', 'fullscreen=yes,titlebar=yes,scrollbars=yes');
      expect(popup.styles()).toEqual(['x.css']);
      expect(popup.print).toHaveBeenCalledOnce();
    });
  });

  describe('useHtmlToPaper()', () => {
    it('Vue 3: returns the installed function, with global options, inside setup()', () => {
      let print;
      const App = defineComponent({ setup () { print = useHtmlToPaper(); return () => h('span'); } });
      createApp(App).use(VueHtmlToPaper, { styles: ['global3.css'] }).mount(document.createElement('div'));
      print('printMe');
      expect(popup.styles()).toEqual(['global3.css']);
    });

    it('Vue 3: the same function is available through inject("htmlToPaper")', () => {
      let injected, global;
      const App = defineComponent({
        setup () { injected = inject('htmlToPaper'); return () => h('span'); },
        mounted () { global = this.$htmlToPaper; },
      });
      createApp(App).use(VueHtmlToPaper).mount(document.createElement('div'));
      expect(injected).toBe(global);
    });

    it('Vue 2.7: works inside setup()', () => {
      let print;
      const Local = Vue2.extend();
      Local.use = Vue2.use;
      Local.use(VueHtmlToPaper, { styles: ['global2.css'] });
      new Local({ setup () { print = useHtmlToPaper(); }, render: (h2) => h2('span') }).$mount();
      print('printMe');
      expect(popup.styles()).toEqual(['global2.css']);
    });

    it('falls back to defaults when the plugin was never installed', async () => {
      vi.resetModules();
      const fresh = await import('../src/index.js');
      fresh.useHtmlToPaper()('printMe');
      expect(open).toHaveBeenCalledWith('', '_blank', expect.any(String));
    });
  });
});
