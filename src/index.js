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

function setOptions(options) {
  Object.assign(defaultOptions, options)
}

function htmlToPaper(el, localOptions, cb) {
  const options = Object.assign({}, defaultOptions, localOptions)
  let { name, replace, styles, specs } = options

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

const VueHtmlToPaper = {
  install(Vue, options) {
    setOptions(options)
    Vue.prototype.$htmlToPaper = htmlToPaper
  }
}

export default VueHtmlToPaper
export { htmlToPaper, setOptions }
