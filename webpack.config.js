const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        dappwrap: './src/dapp-wrap.js',
        dappdelegate: './src/dapp-delegate.js',
        dappclaim: './src/dapp-claim.js',
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
}