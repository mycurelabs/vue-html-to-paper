function addStyles(win, styles) {
  styles.forEach(style => {
    const link = win.document.createElement("link")
    link.setAttribute("rel", "stylesheet")
    link.setAttribute("type", "text/css")
    link.setAttribute("href", style)
    win.document.getElementsByTagName("head")[0].appendChild(link)
  })
}

const defaultOptions = {
  name: "_blank",
  specs: ["fullscreen=yes", "titlebar=yes", "scrollbars=yes"],
  replace: true,
  styles: []
}

const getOrDefault = (local, global) => field =>
  local[field]
    ? local[field]
    : global[field]
    ? global[field]
    : defaultOptions[field]

const VueHtmlToPaper = {
  install(Vue, options = {}) {
    Vue.prototype.$htmlToPaper = (el, localOptions, cb) => {
      // If has localOptions
      const get = getOrDefault(localOptions, options)
      const name = get("name")
      const replace = get("replace")
      const styles = get("styles")
      let specs = get("specs")

      if (process.env.NODE_ENV !== "production") {
        console.warn(styles)
      }

      specs = !!specs.length ? specs.join(",") : ""

      const element = document.getElementById(el)

      if (!element) {
        alert(`Element to print #${el} not found!`)
        return cb ? undefined : Promise.reject()
      }

      const url = ""
      const win = window.open(url, name, specs, replace)

      win.document.write(
        [
          `<html>`,
          `<head>`,
          `<title>${document.title}</title>`,
          `</head>`,
          `<body>${element.innerHTML}</body>`,
          `</html>`
        ].join("")
      )

      addStyles(win, styles)

      const promise = new Promise(resolve => {
        setTimeout(() => {
          win.document.close()
          win.focus()
          win.print()
          win.close()

          if (cb) cb()
          resolve()
        }, 1000)
      })

      return cb ? true : promise
    }
  }
}

export default VueHtmlToPaper
