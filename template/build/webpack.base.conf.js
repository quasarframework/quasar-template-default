const
  path = require('path'),
  webpack = require('webpack'),
  merge = require('webpack-merge'),
  ProgressBarPlugin = require('progress-bar-webpack-plugin')

const
  config = require('../config'),
  env = require('./env-utils'),
  vueLoaderConfig = require('./vue-loader.conf')

const projectRoot = path.resolve(__dirname, '../')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

function processEntry (entry) {
  if (!config.supportIE) {
    return [ entry ]
  }

  const iePolyfill = resolve(`node_modules/quasar-framework/dist/quasar.ie.polyfills.js`)
  return Array.isArray(entry)
    ? [ iePolyfill ].concat(entry)
    : [ iePolyfill, entry ]
}

module.exports = {
  entry: {
    app: processEntry('./src/main.js')
  },
  resolve: {
    extensions: [`.${env.platform.theme}.js`, '.js', `.${env.platform.theme}.vue`, '.vue', '.json'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: merge(
      {
        quasar: resolve(`node_modules/quasar-framework/dist/quasar.${env.platform.theme}.esm.js`),
        'quasar-theme': resolve(`src/themes/app.${env.platform.theme}.styl`),
        variables: resolve(__dirname, 'src/themes/quasar.variables.styl')
      },
      config.aliases
    )
  },
  module: {
    rules: [
      { // eslint
        enforce: 'pre',
        test: /\.(vue|js)$/,
        loader: 'eslint-loader',
        include: projectRoot,
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: resolve('src')
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config[env.prod ? 'build' : 'dev'].env,
      'DEV': env.dev,
      'PROD': env.prod,
      '__THEME__': '"' + env.platform.theme + '"'
    }),
    new ProgressBarPlugin({
      format: config.progressFormat
    })
  ],
  performance: {
    hints: false
  }
}
