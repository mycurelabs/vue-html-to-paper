// Compiled with `tsc --noEmit` against Vue 2.7's types ('vue' is mapped to the
// vue2 alias in tsconfig.json); never executed.
import Vue, { defineComponent } from 'vue';
import VueHtmlToPaper, { htmlToPaper, useHtmlToPaper, type HtmlToPaper, type Options } from 'vue-html-to-paper';

const options: Options = { styles: ['a.css'], autoClose: false, timeout: 500 };

// Plugin installs with Vue.use().
Vue.use(VueHtmlToPaper, options);

// this.$htmlToPaper is typed in defineComponent() components.
defineComponent({
  methods: {
    async print (): Promise<boolean> {
      return this.$htmlToPaper('printMe', { windowTitle: 'x' });
    },
  },
  setup () {
    const print: HtmlToPaper = useHtmlToPaper();
    return { print };
  },
});

const done: Promise<boolean> = htmlToPaper('printMe');
void done;

