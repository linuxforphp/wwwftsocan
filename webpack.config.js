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
    externalsPresets: { node: true },
    externals: [nodeExternals()],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public/js'),
    },
    plugins: [
      // Instead of fallback.
      new NodePolyfillPlugin(),
    ],
    resolve: {
        fallback: {
            fs: false
        },
    }
};

module.exports = config;
