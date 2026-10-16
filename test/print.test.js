import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from 'vue';
import VueHtmlToPaper from '../src/index.js';
import { mockPopup, mountTarget } from './popup.js';

const install = (options) => createApp({}).use(VueHtmlToPaper, options).config.globalProperties.$htmlToPaper;

describe('print behaviour', () => {
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

  // mycurelabs/vue-html-to-paper#126: without document.close() Chrome keeps
  // the popup in the "loading" state and print() never shows the dialog.
  it('closes the popup document stream before printing', () => {
    install()('printMe');
    expect(popup.document.close).toHaveBeenCalledOnce();
    vi.runAllTimers();
    expect(popup.document.close.mock.invocationCallOrder[0])
      .toBeLessThan(popup.print.mock.invocationCallOrder[0]);
  });

  it('injects styles before the document stream is closed', () => {
    install({ styles: ['a.css'] })('printMe');
    expect(popup.styles()).toEqual(['a.css']);
    expect(popup.document.write.mock.invocationCallOrder.at(-1))
      .toBeLessThan(popup.document.close.mock.invocationCallOrder[0]);
  });

  it('writes a standards-mode document', () => {
    install()('printMe');
    expect(popup.document.write.mock.calls.join('')).toMatch(/^\s*<!DOCTYPE html>/i);
  });

  it('does not log anything to the console', () => {
    const warn = vi.spyOn(console, 'warn');
    const log = vi.spyOn(console, 'log');
    install()('printMe');
    vi.runAllTimers();
    expect(warn).not.toHaveBeenCalled();
    expect(log).not.toHaveBeenCalled();
  });

  it('lets a local autoClose: true override a global autoClose: false', () => {
    install({ autoClose: false })('printMe', { autoClose: true });
    vi.runAllTimers();
    expect(popup.close).toHaveBeenCalledOnce();
  });

  it('ignores local options that are undefined', () => {
    install({ name: 'global', styles: ['g.css'] })('printMe', { name: undefined, styles: undefined });
    expect(open).toHaveBeenCalledWith('', 'global', expect.any(String));
    expect(popup.styles()).toEqual(['g.css']);
  });

  it('supports an empty specs list', () => {
    install()('printMe', { specs: [] });
    expect(open).toHaveBeenCalledWith('', '_blank', '');
  });

  describe('timeout option', () => {
    it('defaults to 1000ms', () => {
      install()('printMe');
      vi.advanceTimersByTime(999);
      expect(popup.print).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(popup.print).toHaveBeenCalledOnce();
    });

    it('can be set globally', () => {
      install({ timeout: 250 })('printMe');
      vi.advanceTimersByTime(250);
      expect(popup.print).toHaveBeenCalledOnce();
    });

    it('can be set locally, including 0', () => {
      install({ timeout: 5000 })('printMe', { timeout: 0 });
      vi.advanceTimersByTime(0);
      expect(popup.print).toHaveBeenCalledOnce();
    });
  });

  it('escapes the window title', () => {
    install()('printMe', { windowTitle: '</title><img src=x onerror=alert(1)> & co' });
    expect(popup.document.title).toBe('</title><img src=x onerror=alert(1)> & co');
    expect(popup.document.head.querySelector('img')).toBeNull();
  });

  it('falls back to the opener title when windowTitle is empty', () => {
    document.title = 'Opener';
    install()('printMe', { windowTitle: '' });
    expect(popup.document.title).toBe('Opener');
  });

  it('resolves to false instead of throwing when the popup is blocked', async () => {
    open.mockReturnValue(null);
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(install()('printMe')).resolves.toBe(false);
    expect(error).toHaveBeenCalledWith(expect.stringContaining('blocked'));
  });
});
