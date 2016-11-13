var
  env = process.env.NODE_ENV
  path = require('path'),
  webpack = require('webpack'),
  config = require('../config'),
  utils = require('./utils'),
  platform = require('./platform'),
  projectRoot = path.resolve(__dirname, '../')

// check env & config/index.js to decide weither to enable CSS Sourcemaps for the
// various preprocessor loaders added to vue at the end of this file
var
  cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap),
  cssSourceMapProd = (env === 'production' && config.build.productionSourceMap),
  useCssSourceMap = cssSourceMapDev || cssSourceMapProd,
  vueLoaders

vueLoaders = utils.styleLoaders({
  sourceMap: useCssSourceMap,
  extract: env === 'production'
})
vueLoaders.js = 'babel-loader'

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: config[env === 'production' ? 'build' : 'dev'].publicPath,
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].[chunkhash].js'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    modules: [
      path.join(__dirname, '../src'),
      "node_modules"
    ],
    alias: {
      quasar: path.resolve(__dirname, '../node_modules/quasar-framework/'),
      src: path.resolve(__dirname, '../src'),
      assets: path.resolve(__dirname, '../src/assets'),
      components: path.resolve(__dirname, '../src/components')
    }
  },
  module: {
    rules: [
      { // eslint
        enforce: 'pre',
        test: /\.(vue|js)$/,
        loader: 'eslint-loader',
        include: projectRoot,
        exclude: /node_modules/
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
          postcss: utils.postcss,
          loaders: vueLoaders
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
      'process.env': config[env === 'development' ? 'dev' : 'build'].env,
      'DEV': env === 'development',
      'PROD': env === 'production',
      '__THEME': '"' + platform.theme + '"'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: env === 'production',
      options: {
        context: path.resolve(__dirname, '../src'),
        eslint: {
          formatter: require('eslint-friendly-formatter')
        },
        postcss: utils.postcss
      }
    })
  ]
}
