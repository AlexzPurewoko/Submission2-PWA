const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/script/main-entry.js',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'scripts/bundle-app.js'
    },
    devServer: {
        host: '0.0.0.0',
        disableHostCheck: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: 'images/[hash]-[name].[ext]'
                    }
                }]
            },

            // for load files (font)
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }] 
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            verbose: true
        }),
        new HtmlWebpackPlugin({
            template: path.resolve('./src/pages/index.html'),
            title: 'Football',
            minify: true
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './src/misc/images',
                    to: 'images'
                },
                {
                    from: './src/misc/manifest.json',
                    to: 'manifest/manifest.json'
                },
                {
                    from: './src/misc/service-worker.js',
                    to: 'service-worker.js'
                }
            ]
        }),

    ]
}