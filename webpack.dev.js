const merge   = require('webpack-merge')
const common  = require('./webpack.common.js')
const webpack = require('webpack')

const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(common, {
  mode: 'development',
  devServer: {
	  hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin({
        cleanStaleWebpackAssets: true
    }),
    // 使用模板
    new HtmlWebpackPlugin({
        title: 'Animate',
        template: './dev/index.html',
        filename: 'index.html'
    })
  ]
})