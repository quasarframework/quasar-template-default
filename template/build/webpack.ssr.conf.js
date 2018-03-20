var 
  config = require('../config'),
  webpack = require('webpack'),
  merge = require('webpack-merge'),
  cssUtils = require('./css-utils'),
  { cloneDeep } = require('lodash'),
  baseWebpackConfig = require('./webpack.base.conf'),
  path = require('path'),
  FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const projectRoot = path.resolve(__dirname, '../')
const serverFolder = config.serverFolder || 'api'
const baseConfig = cloneDeep(baseWebpackConfig)

module.exports = Object.assign({}, baseConfig, {
  target: 'node',
  watch: true,
  devServer: undefined,
  devtool: '#cheap-module-eval-source-map',
  entry: [
    path.resolve(__dirname, `../${serverFolder}/vue-server-side-rendering.js`)
  ],
  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, `../${serverFolder}/src/ssr/`),
    filename: 'compiled-ssr.js',
  },
  module: {
    rules: cssUtils.styleRules({
      sourceMap: config.dev.cssSourceMap,
      postcss: true
    }).concat([
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
            sourceMap: false,
            extract: false
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
    ])
  },
  plugins: baseConfig.plugins.concat([
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin({
      clearConsole: config.dev.clearConsoleOnRebuild
    })
  ]),
  performance: {
    hints: false
  }
})