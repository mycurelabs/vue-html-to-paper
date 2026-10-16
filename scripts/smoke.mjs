// Loads every published bundle the way a consumer would and checks that each
// one exposes the plugin (an object with an `install` function).
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const isPlugin = (p) => typeof p?.install === 'function';

const helpers = (m, label) => {
  assert.equal(typeof m.htmlToPaper, 'function', `${label} htmlToPaper`);
  assert.equal(typeof m.useHtmlToPaper, 'function', `${label} useHtmlToPaper`);
};

const esm = await import('vue-html-to-paper');
assert.ok(isPlugin(esm.default), 'ESM default export');
assert.equal(esm.VueHtmlToPaper, esm.default, 'ESM named VueHtmlToPaper');
helpers(esm, 'ESM');

const cjs = require('vue-html-to-paper');
assert.ok(isPlugin(cjs.default), 'CJS exports.default');
assert.equal(cjs.VueHtmlToPaper, cjs.default, 'CJS exports.VueHtmlToPaper');
helpers(cjs, 'CJS');

for (const file of ['build/vue-html-to-paper.js', 'build/vue-html-to-paper.min.js']) {
  const sandbox = {};
  sandbox.self = sandbox;
  vm.runInNewContext(readFileSync(file, 'utf8'), sandbox);
  assert.ok(isPlugin(sandbox.VueHtmlToPaper), `UMD global in ${file}`);
  helpers(sandbox.VueHtmlToPaper, file);
}

console.log('smoke: ESM, CJS and UMD bundles all expose the plugin, htmlToPaper and useHtmlToPaper');
