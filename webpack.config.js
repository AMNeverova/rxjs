const path = require('path')

module.exports = {
    entry: './index.js',
    output: {
        path: path.join(__dirname, '/public'),
        filename: 'index.bundle.js',
        publicPath: './public/'
    },
    devServer: {
        liveReload: false,
        contentBase: './',
        publicPath: '/public/',
        open: true
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: true
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },

            {
                test: /\.(png|jpg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'images'
                }
            }, {
                test: /\.(ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'font'
                }
            }
        ]
    }
}
