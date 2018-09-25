var path = require('path');
var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var mode = 'production';

var config = {
    mode: mode,
    entry: {
        'main': './src/main.ts',
        'main.min': './src/main.ts'
    },

    output: {
        path: path.resolve(__dirname, 'js'),
        filename: '[name].js'
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx' ]
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: false,
                parallel: true,
                uglifyOptions: {
                    compress: true,
                    ecma: 5,
                    mangle: true
                }
            })
        ]
    },

    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'awesome-typescript-loader',
            exclude: /node_modules/
        },{
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        },{
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name (file) {
                            if (mode === 'development') {
                                return '[path][name].[ext]';
                            }

                            return '[hash].[ext]';
                        }
                    }
                },
                {
                    loader: 'image-webpack-loader',
                    options: {
                        bypassOnDebug: true, // webpack@1.x
                        disable: false // webpack@2.x and newer
                    }
                }
            ]
        },            {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }]
        }]
    }
};

module.exports = config;
