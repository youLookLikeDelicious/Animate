const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: ["@babel/polyfill", "./src/index.js"],
    output: {
        path: path.resolve(__dirname, "dir"),
        filename: "index.js",
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
                        presets: [["@babel/preset-env", {targets: {
                            "chrome": "58",
                            "ie": "9"
                        }}]],
                    },
                }
            }
        ]
    },
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
