import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp, h } from 'vue';
import VueHtmlToPaper from '../src/index.js';
import { mockPopup, mountTarget } from './popup.js';

const install = (options) => createApp({}).use(VueHtmlToPaper, options).config.globalProperties.$htmlToPaper;

describe('Vue 3: app.use(VueHtmlToPaper)', () => {
  let popup, open;

  beforeEach(() => {
    vi.useFakeTimers();
    ({ popup, open } = mockPopup());
    mountTarget();
    document.title = 'Opener title';
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('registers $htmlToPaper on globalProperties', () => {
    expect(typeof install()).toBe('function');
  });

  it('is callable as this.$htmlToPaper from a mounted component', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    let vm;
    createApp({ mounted () { vm = this; }, render: () => h('span') }).use(VueHtmlToPaper).mount(root);
    vm.$htmlToPaper('printMe');
    expect(open).toHaveBeenCalledOnce();
  });

  it('opens a window with the default name and specs', () => {
    install()('printMe');
    expect(open).toHaveBeenCalledWith('', '_blank', 'fullscreen=yes,titlebar=yes,scrollbars=yes');
  });

  it('writes the element markup and the opener title into the popup', () => {
    install()('printMe');
    expect(popup.document.body.innerHTML).toContain('<h1>Invoice #42</h1>');
    expect(popup.document.title).toBe('Opener title');
  });

  it('injects global styles as stylesheet links', () => {
    install({ styles: ['a.css', 'b.css'] })('printMe');
    expect(popup.styles()).toEqual(['a.css', 'b.css']);
  });

  it('prints after 1000ms, closes the popup, then calls the callback', () => {
    const cb = vi.fn();
    install()('printMe', null, cb);
    vi.advanceTimersByTime(999);
    expect(popup.print).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(popup.print).toHaveBeenCalledOnce();
    expect(cb).toHaveBeenCalledOnce();
    vi.advanceTimersByTime(1);
    expect(popup.close).toHaveBeenCalledOnce();
  });

  it('local options override global options', () => {
    install({ name: 'global', styles: ['global.css'], windowTitle: 'Global' })('printMe', {
      name: 'local',
      specs: ['width=100'],
      styles: ['local.css'],
      windowTitle: 'Local',
    });
    expect(open).toHaveBeenCalledWith('', 'local', 'width=100');
    expect(popup.styles()).toEqual(['local.css']);
    expect(popup.document.title).toBe('Local');
  });

  it('keeps the popup open when autoClose is false (global or local)', () => {
    install({ autoClose: false })('printMe');
    install()('printMe', { autoClose: false });
    vi.runAllTimers();
    expect(popup.print).toHaveBeenCalledTimes(2);
    expect(popup.close).not.toHaveBeenCalled();
  });

  it('alerts and opens nothing when the element does not exist', () => {
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});
    install()('missing');
    expect(alert).toHaveBeenCalledWith('Element to print #missing not found!');
    expect(open).not.toHaveBeenCalled();
  });
});
