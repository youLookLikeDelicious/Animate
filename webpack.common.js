const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "[name].bundle.js",
        chunkFilename: "[name].bundle.js",
    },
    module: {
        rules: [
            // 导入js的规则
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    },
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: true
        }),
        // 使用模板
        new HtmlWebpackPlugin({
            title: 'Animate',
            template: './src/index.html',
            filename: 'index.html'
        })
    ],
    optimization: {
        // 编译代码
        minimizer: [new UglifyJsPlugin({
            uglifyOptions: {
                ie8: false,
                output: {
                    comments: false,
                    beautify: false
                },
                compress: true,
                warning: false
            }
        })]
    },
}
