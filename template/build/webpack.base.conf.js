var
  path = require('path'),
  webpack = require('webpack'),
  config = require('../config'),
  cssUtils = require('./css-utils'),
  env = require('./env-utils'),
  merge = require('webpack-merge'),
  projectRoot = path.resolve(__dirname, '../'),
  ProgressBarPlugin = require('progress-bar-webpack-plugin'),
  useCssSourceMap =
    (env.dev && config.dev.cssSourceMap) ||
    (env.prod && config.build.productionSourceMap)

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
  output: {
    path: resolve('dist'),
    publicPath: config[env.prod ? 'build' : 'dev'].publicPath,
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].[chunkhash].js'
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
        test: /\.js$/,
        loader: 'babel-loader',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postcss: cssUtils.postcss,
          loaders: merge({js: 'babel-loader'}, cssUtils.styleLoaders({
            sourceMap: useCssSourceMap,
            extract: env.prod
          }))
        }
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
    new webpack.LoaderOptionsPlugin({
      minimize: env.prod,
      options: {
        context: resolve('src'),
        postcss: cssUtils.postcss
      }
    }),
    new ProgressBarPlugin({
      format: config.progressFormat
    })
  ],
  performance: {
    hints: false
  }
}
