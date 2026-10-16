import { vi } from 'vitest';

// jsdom does not implement window.open(), so tests use a fake popup. Whatever
// the plugin document.write()s is parsed into a real Document, so assertions
// can query the printed markup and the injected <link> tags.
export function mockPopup () {
  let html = '';
  let parsed = new DOMParser().parseFromString('', 'text/html');
  const document = {
    write: vi.fn((chunk) => {
      html += chunk;
      parsed = new DOMParser().parseFromString(html, 'text/html');
    }),
    close: vi.fn(),
    createElement: (tag) => parsed.createElement(tag),
    getElementsByTagName: (tag) => parsed.getElementsByTagName(tag),
    get title () { return parsed.title; },
    get body () { return parsed.body; },
    get head () { return parsed.head; },
  };
  const popup = {
    document,
    opener: null,
    focus: vi.fn(),
    print: vi.fn(),
    close: vi.fn(),
    styles: () => [...parsed.querySelectorAll('link[rel=stylesheet]')].map((l) => l.getAttribute('href')),
  };
  const open = vi.spyOn(window, 'open').mockImplementation(() => popup);
  return { popup, open };
}

export function mountTarget (id = 'printMe', html = '<h1>Invoice #42</h1><p>Total: 100</p>') {
  const el = window.document.createElement('div');
  el.id = id;
  el.innerHTML = html;
  window.document.body.appendChild(el);
  return el;
}
