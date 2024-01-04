const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        dappcommon: './src/dapp-common.js',
        flareutils: './src/flare-utils.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public/js'),
    },
    optimization: {
        splitChunks: {
          chunks: 'all',
        },
    },
    watch: true,
}