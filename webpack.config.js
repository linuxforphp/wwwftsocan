const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require('webpack');
const nodeExternals = require("webpack-node-externals");
const path = require('path');

const config = {
    mode: 'production',
    entry: {
        dappcommon: './src/dapp-common.js',
        flareutils: './src/flare-utils.js'
    },
    externals: [nodeExternals({
        allowlist: ['assert', 'fs']
    })],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public/js'),
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
        fallback: {
          fs: false,
          tls: false,
          net: false,
          path: false,
          zlib: false,
          http: false,
          https: false,
          stream: false,
          crypto: false,
          assert: false,
        },
    }  
};

module.exports = config;
