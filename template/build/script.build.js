require('./ensure-versions')()
require('./script.clean')

const config = require('../config')
process.env.NODE_ENV = config.build.debug
  ? 'development'
  : 'production'

const
  path = require('path'),
  env = require('./env-utils'),
  cssUtils = require('./css-utils'),
  chalk = require('chalk'),
  webpack = require('webpack')

const
  webpackConfig = require('./webpack.prod.conf')

console.log(chalk.bold(' WARNING!'))
console.log(' Do NOT use VueRouter\'s "history" mode if')
console.log(' building for Cordova or Electron.\n')

console.log(chalk.bold(` Building Quasar App with "${env.platform.theme}" theme...\n`))

function finalize () {
  const dest = path.relative(path.join(__dirname, '..'), config.build.dir)
  console.log(chalk.cyan(
    `\n Build complete with "${chalk.bold(env.platform.theme)}" theme in "${chalk.bold(dest)}" folder.\n`
  ))

  console.log(chalk.bold(' Built files are meant to be served over an HTTP server.'))
  console.log(chalk.bold(` Opening ${config.build.htmlFilename} over file:// won\'t work.`))

  if (config.build.debug) {
    console.log(chalk.cyan(
      '\n Built for ' + chalk.bold('DEBUG') +
      '\n - Do NOT deploy this version to production.'
    ))
  }
}

webpack(webpackConfig, (err, stats) => {
  if (err) throw err

  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')

  if (stats.hasErrors()) {
    console.log(chalk.red(' Build failed with errors.\n'))
    process.exit(1)
  }

  if (config.build.purifyCSS) {
    cssUtils.purify(config.build.dir).then(finalize)
  }
  else {
    finalize()
  }
})
