var
  path = require('path'),
  webpack = require('webpack'),
  config = require('../config'),
  cssUtils = require('./css-utils'),
  env = require('./env-utils'),
  merge = require('webpack-merge'),
  projectRoot = path.resolve(__dirname, '../'),
  ProgressBarPlugin = require('progress-bar-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin'),
  useCssSourceMap =
    (env.dev && config.dev.cssSourceMap) ||
    (env.prod && config.build.productionSourceMap)

module.exports = {
  entry: {
    app: './src/main.ts'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: config[env.prod ? 'build' : 'dev'].publicPath,
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].[chunkhash].js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      path.join(__dirname, '../src'),
      'node_modules'
    ],
    alias: config.aliases
  },
  module: {
    rules: [
       { 
        test: /\.ts$/, 
        exclude: /node_modules/, enforce: 'pre', 
        loader: 'tslint-loader' 
      },
      {
        test: /\.ts$/,
        exclude: /node_modules|vue\/src/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          esModule: true,
          postcss: cssUtils.postcss,
          loaders: merge(
            cssUtils.styleLoaders({
              sourceMap: useCssSourceMap,
              extract: env.prod
            }),
            { ts: 'ts-loader!tslint-loader' }
          )
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
    /*
      Take note!
      Uncomment if you wish to load only one Moment locale:

      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    */
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/manifest.json'),
        to: path.resolve(__dirname, '../dist/manifest.json')
      },
      {
        from: path.resolve(__dirname, '../src/icons'),
        to: path.resolve(__dirname, '../dist')
      }
    ], {}),
    new SWPrecacheWebpackPlugin({
      cacheId: 'my-quasar-app',
      filename: 'service-worker.js',
      minify: false,
      stripPrefix: 'dist/'
    }),
    new webpack.DefinePlugin({
      'process.env': config[env.prod ? 'build' : 'dev'].env,
      'DEV': env.dev,
      'PROD': env.prod,
      '__THEME': '"' + env.platform.theme + '"'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: env.prod,
      options: {
        context: path.resolve(__dirname, '../src'),
        postcss: cssUtils.postcss
      }
    }),
    new ProgressBarPlugin({
      format: config.progressFormat
    })
  ],
  performance: {
    hints: false
  },
  devtool: 'source-map'
}
