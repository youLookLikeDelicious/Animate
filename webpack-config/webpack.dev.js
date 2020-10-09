const merge   = require('webpack-merge')
const common  = require('./webpack.common.js')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(common, {
  mode: 'development',
  entry: ["@babel/polyfill", "./dev/index.js"],
  devServer: {
	  hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // 使用模板
    new HtmlWebpackPlugin({
        title: 'Animate',
        template: './dev/template/index.html',
        filename: 'index.html'
    })
]
})