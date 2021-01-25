const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const production = (process.env.NODE_ENV === 'production')
    ? 'production'
    : 'development';

module.exports = {
  mode: production,
  entry: {
    content: [
      path.join(__dirname, './src/content'),
      path.join(__dirname, './src/content.css'),
    ],
  },
  devServer: {
    compress: true,
    contentBase: './src',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [{
      test: /\.(ts|tsx)?$/i,
      use: 'ts-loader',
      exclude: [/node_modules/],
    }, {
      test: /\.(css)?$/i,
      use: [MiniCssExtractPlugin.loader, 'css-loader'],
    }, {
      test: /\.(eot|ttf|woff|woff2)$/i,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'typeface/'
        }
      }],
      // loader: 'url-loader',
      // options: {
      //   limit: 8192,
      // },
    }],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].min.css',
    }),
  ],
  optimization: {
    minimizer: [new TerserPlugin({
      terserOptions: {
        format: {
          comments: false,
        },
      },
      extractComments: false,
    })],
  },
  output: {
    path: path.join(__dirname, './src'),
    publicPath: 'chrome-extension://__MSG_@@extension_id__/',
    filename: './[name].min.js',
  },
};
