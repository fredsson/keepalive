const path              = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const srcPath      = path.resolve(__dirname, 'src');
const buildPath    = path.resolve(__dirname, 'dist');

module.exports = {
  entry: path.join(srcPath, 'app.ts'),

  output: {
    path: buildPath,
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {test: /\.ts$/, exclude: /node_modules/, loader: 'ts-loader'},
      {test: /\.(s*)css$/, use: ['style-loader', 'css-loader', 'sass-loader']}
    ]
  },

  resolve: {
    extensions: ['*', '.js', '.ts']
  },

  devtool: 'inline-source-map',

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
      filename: 'index.html'
    })
  ]
};