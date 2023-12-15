const path = require('path')
const child_process = require('child_process')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin")
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const getConfig = require('@qc/bin/config')
const packageInfo = require('./package.json')
const manifest = require('./public/manifest.json')

const getCommitHash = ()  => {
  try {
    return child_process
      .execSync('git rev-parse --short HEAD')
      .toString()
  } catch (error) {
    return ''
  }
}

const commitHash = getCommitHash()
const CONFIG_PATH = path.resolve(__dirname, '..', '..', '.env')
let appConfig

try {
  appConfig = getConfig(CONFIG_PATH)
} catch (error) {
  console.error(error.message);
  process.exit(1)
}

module.exports = () => {
  const isProduction = process.env.NODE_ENV === 'production'
  const mode = isProduction ? 'production' : 'development'
  const envVars = {
    __DEV__: JSON.stringify(!isProduction),
    __COMMIT_HASH__: JSON.stringify(commitHash),
    VERSION: JSON.stringify(packageInfo.version),
    SECOND: JSON.stringify(1000),
    MINUTE: JSON.stringify(60000),
    HOUR: JSON.stringify(3600000),
    PROVIDER_TAG: JSON.stringify("provider"),
  }
  Object.keys(appConfig).forEach(key => {
    if (typeof appConfig[key] === 'string' && /^(true|false)$/i.test(appConfig[key])) {
      envVars[key] = appConfig[key].toLowerCase()
    } else {
      envVars[key] = JSON.stringify(appConfig[key])
    }
  })
  console.log('Running in ', mode, ' mode')
  const plugins = [
    new webpack.DefinePlugin(envVars),
    new HtmlWebpackPlugin({
      hash: isProduction,
      minify: isProduction,
      template: path.resolve(__dirname,'./public/index.html'),
      title: appConfig.APP_NAME,
      description: appConfig.APP_DESCRIPTION,
    }),
    new ForkTsCheckerWebpackPlugin({
      async: !isProduction
    })
  ]
  if (isProduction) {
    plugins.push(new CopyWebpackPlugin({
      patterns: [
        {
          from: './public',
          globOptions: {
            ignore: ['**/*.html', '**/manifest.json'],
          },
        }
      ]
    }))
    plugins.push(new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].chunk.css',
    }))
    plugins.push(new WebpackManifestPlugin({
      seed: manifest,
      generate: (seed) => ({
        ...seed,
        short_name: appConfig.APP_NAME,
        name: appConfig.APP_NAME,
      })
    }))
    plugins.push(new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }))
  }
  if (process.env.ANALYZE) {
    plugins.push(new BundleAnalyzerPlugin())
  }
  return {
    mode,
    target: 'browserslist',
    devtool: isProduction ? undefined : 'inline-source-map',
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'public'),
      },
      historyApiFallback: true,
      // host: '0.0.0.0',
      hot: true,
      https: true,
      open: true,
      port: process.env.PORT || 3001,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ],
        },
        {
          test: /\.(jpe?g|png|gif)$/,
          type: 'asset',
          generator: {
            filename: 'images/[hash][ext]'
          }
        },
        {
          test: /\.(mp3|wav|ogg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'media/[hash][ext]'
          }
        },
        {
          test: /\.svg$/,
          issuer: /\.tsx?$/,
          use: '@svgr/webpack',
        },
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      fallback: {
        url: false,
        assert: false,
        http: false,
        https: false,
        zlib: false,
        stream: false,
        os: false,
        events: false,
        http: false,
        https: false,
        zlib: false,
        fs: false,
        child_process: false,
        tls: false,
        net: false,
        'nativescript-xmpp-client': false,
      },
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      chunkFilename: isProduction ? '[name].[contenthash].js' : '[name].js',
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]((?!(react|firebase)).)*[\\/]/,
            name: 'vendors'
          },
          react: {
            test: /[\\/]node_modules[\\/]react(-.*)?[\\/]/,
            name: 'react',
            chunks: 'all',
          },
          firebase: {
            test: /[\\/]node_modules[\\/]@?firebase[\\/]/,
            name: 'firebase',
            chunks: 'all',
            enforce: true,
          },
          quickblox: {
            test: /quickblox(\.min)?\.js$/,
            name: 'quickblox',
            chunks: 'all',
            enforce: true,
          },
        }
      }
    },
    plugins
  }
}
