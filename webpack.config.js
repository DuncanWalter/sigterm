const webpack = require('webpack')
const { join } = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

function clean(...entries) {
  return entries.filter(entry => !!entry && entry !== true)
}

module.exports = (function createConfig(production, target) {
  const sourcePath = join(process.cwd(), target, 'src')
  const outPath = join(process.cwd(), target, 'build')
  return {
    mode: production ? 'production' : 'development',
    context: sourcePath,
    entry: {
      index: './index.tsx',
    },
    output: {
      path: outPath,
      filename: 'bundle.js',
      chunkFilename: '[id].chunk.js',
      publicPath: '/',
    },
    target: 'web',
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
      mainFields: ['module', 'browser', 'main'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: clean(
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: clean(
                  production || require('@babel/preset-react'),
                  production || require('@babel/preset-typescript'),
                  clean(require('@babel/preset-env'), {
                    modules: false,
                    targets: 'last 1 version, not dead, > 1% in US',
                  }),
                ),
              },
            },
            production && require.resolve('ts-loader'),
          ),
        },
        {
          test: /\.css$/,
          use: [
            production
              ? MiniCssExtractPlugin.loader
              : require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              query: {
                modules: true,
                sourceMap: !production,
                importLoaders: 1,
                localIdentName: production
                  ? '[hash:base64:5]'
                  : '[local]-[hash:base64:3]',
              },
            },
          ],
        },
      ],
    },
    plugins: clean(
      new webpack.EnvironmentPlugin({
        NODE_ENV: production ? 'production' : 'development',
        DEBUG: false,
      }),
      production &&
        new MiniCssExtractPlugin({
          filename: 'bundle.css',
          chunkFilename: '[id].chunk.css',
          disable: !production,
        }),
      production &&
        new CompressionPlugin({
          test: production ? /\.(js|css)$/ : '__disabled__',
        }),
      new HtmlWebpackPlugin({
        template: join(sourcePath, 'index.html'),
      }),
    ),
    devServer: {
      contentBase: sourcePath,
      hot: true,
      inline: true,
      historyApiFallback: { disableDotRule: true },
      stats: 'minimal',
      clientLogLevel: 'warning',
    },
    devtool: production ? 'hidden-source-map' : 'cheap-module-eval-source-map',
  }
})(false, '.')
