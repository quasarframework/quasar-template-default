const
  path = require('path'),
  chalk = require('chalk')

// resolves path to root project folder
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  // Webpack aliases
  aliases: {
    src: resolve('src'),
    assets: resolve('src/assets'),
    '@': resolve('src/components')
  },

  // Progress Bar Webpack plugin format
  // https://github.com/clessg/progress-bar-webpack-plugin#options
  progressFormat: ` [:bar] ${chalk.bold(':percent')} (:msg)`,

  // Default theme to build with ('ios' or 'mat')
  defaultTheme: 'mat',

  // Add support for IE browser
  supportIE: false,

  build: {
    env: require('./prod.env'),
    publicPath: '',

    // destination folder for distributables
    // leave "dist" if you are using wrappers (Cordova, Electron, ...)
    dir: resolve('dist'),

    // Name of html file being generated
    // Leave "index.html" if you are using wrappers (Cordova, Electron, ...)
    // Change only if you know what you are doing.
    htmlFilename: 'index.html',

    // Turn this on if you want to
    // debug a production version
    debug: false,

    // Removes unused CSS (default is disabled).
    // May have side-effects in removing used CSS, so use it with care.
    purifyCSS: false
  },
  dev: {
    env: require('./dev.env'),
    cssSourceMap: true,
    publicPath: '/',

    // auto open browser or not
    openBrowser: true,
    port: 8080,

    // If for example you are using Quasar Play
    // to generate a QR code then on each dev (re)compilation
    // you need to avoid clearing out the console, so set this
    // to "false", otherwise you can set it to "true" to always
    // have only the messages regarding your last (re)compilation.
    clearConsoleOnRebuild: false,

    // Proxy your API if using any.
    // Also see /build/script.dev.js and search for "proxy api requests"
    // https://github.com/chimurai/http-proxy-middleware
    proxyTable: {}
  }
}

/*
 * proxyTable example:
 *
   proxyTable: {
      // proxy all requests starting with /api
      '/api': {
        target: 'https://some.address.com/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
 */
