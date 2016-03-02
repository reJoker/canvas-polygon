var webpack = require('webpack');
module.exports = {
    entry: {
        bundle: './example/app.js',
        bundle2: './example/app2.js',
        canvasPolygon: './example/export.js'
    },
    output: {
        filename: '[name].js',
        path: './example/assets'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]
}
