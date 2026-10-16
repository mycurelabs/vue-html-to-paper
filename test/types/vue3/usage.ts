// Compiled with `tsc --noEmit` (npm run test:types); never executed.
import { createApp, defineComponent } from 'vue';
import VueHtmlToPaper, { VueHtmlToPaper as Named, htmlToPaper, useHtmlToPaper, type HtmlToPaper, type Options } from 'vue-html-to-paper';

const options: Options = { name: '_blank', specs: ['titlebar=yes'], styles: ['a.css'], autoClose: false, timeout: 500, windowTitle: 'x' };

// Plugin installs on Vue 3.
createApp({}).use(VueHtmlToPaper, options);
createApp({}).use(Named);

// this.$htmlToPaper is typed in components.
defineComponent({
  methods: {
    async print (): Promise<boolean> {
      const ok: boolean = await this.$htmlToPaper('printMe', { styles: [] }, () => undefined);
      await this.$htmlToPaper(document.body);
      await this.$htmlToPaper({ $el: document.body });
      await this.$htmlToPaper('printMe', null);
      return ok;
    },
  },
});

// Composition API helpers.
const fromSetup: HtmlToPaper = useHtmlToPaper();
const done: Promise<boolean> = htmlToPaper('printMe');
void fromSetup; void done;

// @ts-expect-error unknown option
htmlToPaper('printMe', { colour: 'red' });
// @ts-expect-error target must be an id, element or component
htmlToPaper(42);
// @ts-expect-error timeout is a number
createApp({}).use(VueHtmlToPaper, { timeout: '1s' });
