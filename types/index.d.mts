/**
 * Options for the print window. Global options are passed to
 * `app.use(VueHtmlToPaper, options)` / `Vue.use(VueHtmlToPaper, options)`;
 * local options passed to a single call override them key by key.
 */
export interface Options {
  /** `window.open()` target name. Default: `'_blank'`. */
  name?: string
  /**
   * `window.open()` window features, joined with commas.
   * Default: `['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes']`.
   * See https://developer.mozilla.org/docs/Web/API/Window/open#windowfeatures
   */
  specs?: string[]
  /** Stylesheet URLs injected as `<link rel="stylesheet">` into the print window. */
  styles?: string[]
  /** Close the print window after printing. Default: `true`. */
  autoClose?: boolean
  /** Milliseconds to wait (for styles to load) before calling `print()`. Default: `1000`. */
  timeout?: number
  /** Title of the print window, used as the default PDF file name. Default: the current `document.title`. */
  windowTitle?: string
  /** @deprecated Ignored. Browsers no longer support `window.open()`'s `replace` argument. */
  replace?: boolean
}

/** An element id, an element, or a component instance (its `$el` is printed). */
export type PrintTarget = string | HTMLElement | { $el: Element }

export interface HtmlToPaper {
  /**
   * Prints the target's inner HTML in a new window.
   * Resolves to `true` once printed and `callback` ran, or `false` when the
   * element was not found or the pop-up was blocked.
   */
  (el: PrintTarget, localOptions?: Options | null, callback?: () => void): Promise<boolean>
}

/** Works with both `app.use()` (Vue 3) and `Vue.use()` (Vue 2). */
export interface VueHtmlToPaperPlugin {
  install(app: any, options?: Options): void
}

declare const VueHtmlToPaper: VueHtmlToPaperPlugin

/** Print function configured by the installed plugin's global options (for `setup()`). */
export declare function useHtmlToPaper(): HtmlToPaper

/** Standalone print function using the default options; no plugin install needed. */
export declare const htmlToPaper: HtmlToPaper

export { VueHtmlToPaper }
export default VueHtmlToPaper

// Types `this.$htmlToPaper` and `$htmlToPaper` in templates. Vue 3 and Vue 2.7
// (defineComponent / <script setup>) both read ComponentCustomProperties.
declare module 'vue' {
  interface ComponentCustomProperties {
    $htmlToPaper: HtmlToPaper
  }
}
