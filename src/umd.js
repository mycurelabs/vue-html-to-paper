// UMD entry: the browser global `VueHtmlToPaper` stays the plugin object (so
// `app.use(VueHtmlToPaper)` / `Vue.use(VueHtmlToPaper)` keep working), with the
// named helpers attached to it.
import VueHtmlToPaper, { htmlToPaper, useHtmlToPaper } from './index.js';

VueHtmlToPaper.htmlToPaper = htmlToPaper;
VueHtmlToPaper.useHtmlToPaper = useHtmlToPaper;

export default VueHtmlToPaper;
