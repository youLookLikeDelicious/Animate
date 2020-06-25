const path = require('path')
const nodeExternals = require('webpack-node-externals')
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin')

module.exports = {
    target: 'node',
    entry: ["@babel/polyfill", "./test/test.spec.js"],
    output: {
        path: path.resolve(__dirname, "../tmp"),
        filename: "test-bundle.js"
    },
    externals: [nodeExternals()],
    node: {
        fs: 'empty'
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
                        presets: [
                            ["@babel/preset-env", {
                                targets: {
                                    "chrome": "58",
                                    "ie": "9"
                                }
                            }]
                        ],
                    },
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: true
        }),
    ]
}