require('./ensure-versions')()

process.env.NODE_ENV = 'development'

const
  chalk = require('chalk'),
  path = require('path'),
  express = require('express'),
  webpack = require('webpack'),
  opn = require('opn'),
  proxyMiddleware = require('http-proxy-middleware'),
  webpackDevMiddleware = require('webpack-dev-middleware'),
  webpackHotMiddleware = require('webpack-hot-middleware'),
  connectHistoryApiFallback = require('connect-history-api-fallback'),

  env = require('./env-utils'),
  config = require('../config'),
  webpackConfig = require('./webpack.dev.conf')

const
  app = express(),
  port = process.env.PORT || config.dev.port,
  uri = 'http://localhost:' + port,
  // Define HTTP proxies to your custom API backend
  // https://github.com/chimurai/http-proxy-middleware
  proxyTable = config.dev.proxyTable

console.log(` Starting dev server with "${chalk.bold(env.platform.theme)}" theme...`)
console.log(` Will listen at ${chalk.bold(uri)}`)
if (config.dev.openBrowser) {
  console.log(' Browser will open when build is ready.\n')
}

const
  compiler = webpack(webpackConfig),
  devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
  }),
  hotMiddleware = webpackHotMiddleware(compiler, {
    log: false,
    heartbeat: 2000
  })

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy requests like API. See /config/index.js -> dev.proxyTable
// https://github.com/chimurai/http-proxy-middleware
Object.keys(proxyTable).forEach(context => {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(connectHistoryApiFallback())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticsPath = path.posix.join(config.dev.publicPath, 'statics/')
app.use(staticsPath, express.static('./src/statics'))

// try to serve Cordova statics for Play App
app.use(express.static(env.platform.cordovaAssets))

let server

const setupPromise = new Promise((resolve, reject) => {
  devMiddleware.waitUntilValid(() => {
    server = app.listen(port, err => {
      if (err) {
        console.error(err)
        process.exit(1)
      }

      if (config.dev.openBrowser) {
        opn(uri)
      }

      resolve()
    })
  })
})

module.exports = {
  ready: setupPromise,
  close () {
    server.close()
  }
}
