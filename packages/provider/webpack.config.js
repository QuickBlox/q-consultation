const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')

const packageInfo = require('./package.json')
const appConfig = require('../../bin/config')
const manifest = require('./public/manifest.json')

module.exports = () => {
  const isProduction = process.env.NODE_ENV === 'production'
  const mode = isProduction ? 'production' : 'development'
  const envVars = {
    __DEV__: JSON.stringify(!isProduction),
    VERSION: JSON.stringify(packageInfo.version),
    SECOND: JSON.stringify(1000),
    MINUTE: JSON.stringify(60000),
    HOUR: JSON.stringify(3600000),
  }
  Object.keys(appConfig).forEach((key) => {
    if (
      typeof appConfig[key] === 'string' &&
      /^(true|false)$/i.test(appConfig[key])
    ) {
      envVars[key] = appConfig[key].toLowerCase()
    } else {
      envVars[key] = JSON.stringify(appConfig[key])
    }
  })
  console.log('Running in ', mode, ' mode')
  const plugins = [
    new webpack.DefinePlugin(envVars),
    new webpack.ProvidePlugin({
      QB: path.resolve(__dirname, '../../quickblox.min.js'),
      QBMediaRecorder: 'media-recorder-js',
    }),
    new MiniCssExtractPlugin({
      filename: isProduction ? '[name].[contenthash].css' : '[name].css',
      chunkFilename: 'styles.css',
    }),
    new HtmlWebpackPlugin({
      hash: isProduction,
      template: __dirname + '/public/index.html',
      title: 'Q-Consultation',
      description: 'Q-Consultation',
    }),
    new WebpackManifestPlugin({
      seed: manifest,
      generate: (seed) => ({
        ...seed,
        short_name: 'Q-Consultation',
        name: 'Q-Consultation',
      }),
    }),
  ]
  if (isProduction) {
    plugins.push(
      new WorkboxWebpackPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
      }),
    )
  }
  return {
    mode,
    target: 'web',
    devtool: isProduction ? undefined : 'inline-source-map',
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'public'),
      },
      historyApiFallback: true,
      host: '0.0.0.0',
      hot: true,
      https: true,
      open: true,
      port: process.env.PORT || 3000,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.(jpe?g|png|gif)$/,
          type: 'asset',
          generator: {
            filename: 'images/[hash][ext]',
          },
        },
        {
          test: /\.(mp3|wav|ogg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'media/[hash][ext]',
          },
        },
        {
          test: /\.svg$/,
          use: '@svgr/webpack',
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      chunkFilename: isProduction ? '[name].[contenthash].js' : '[name].js',
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]((?!react).)*[\\/]/,
            name: 'vendors',
          },
          react: {
            test: /[\\/]node_modules[\\/]react(-.*)?[\\/]/,
            name: 'react',
            chunks: 'all',
          },
          quickblox: {
            test: /quickblox(\.min)?\.js$/,
            name: 'quickblox',
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    plugins,
  }
}
