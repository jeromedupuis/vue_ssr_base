const webpack = require('webpack');
const merge = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const baseConfig = require("./webpack.base.config");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");

const env = require('../env/dev.env');

module.exports = merge(baseConfig, {
	entry: './src/entry-server.js',
	target: 'node',
	devtool: 'source-map',
	resolve: {
		alias: {
			'axios-client': './axios-server.js'
		}
	},
	output: {
		filename: 'server-bundle.js',
		libraryTarget: 'commonjs2'
	},
	externals: nodeExternals({
		whitelist: /\.css$/
	}),

	plugins: [
		new webpack.DefinePlugin({
			'process.env': env
		}),
		new VueSSRServerPlugin()
	]
});
