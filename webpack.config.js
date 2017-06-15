/* eslint-env node */

const path = require('path');
const webpack = require('webpack');

module.exports = {

    entry: './src/index.js',

    module: {
        rules: [{
            test: /\.jsx?$/,
            include: [
                path.resolve(__dirname, 'src'),
            ],
            exclude: [ path.resolve(__dirname, 'node_modules') ],
            loader: 'babel-loader',
        }]
    },

    output: {
        filename: 'bundle.js',
    },

    devtool: 'source-map',

    devServer: {
    },

    plugins:[
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],

};
