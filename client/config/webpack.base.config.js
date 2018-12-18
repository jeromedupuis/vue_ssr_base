const path = require("path");
const webpack = require("webpack");
const vueConfig = require('./vue.loader.config');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
	devtool: isProd ? false : '#cheap-module-source-map',
	output: {
		path: path.resolve(__dirname, '../dist'),
		publicPath: '/dist/',
		filename: '[name].[chunkhash].js'
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../src'),
      '@@': path.resolve(__dirname, '../../common'),
      'node_modules': path.resolve(__dirname, '../node_modules'),
			'api': path.resolve(__dirname, '../src/api')
		}
	},
	module: {
		noParse: /es6-promise\.js$/,
		rules: [
			{
					test: /\.(js|vue)$/,
					loader: 'eslint-loader',
					enforce: 'pre',
					options: {
							formatter: require('eslint-friendly-formatter')
					}
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: vueConfig
			},
			{
        test: /\.js$/,
        loader: 'babel-loader',
				exclude: /node_modules/,
        include: [
          path.resolve(__dirname, '../src'),
          path.resolve(__dirname, '../test'),
					path.resolve(__dirname, '../node_modules/webpack-dev-server/client')
        ]
      },
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: '[name].[ext]?[hash]'
				}
			},
			{
					test: /\.svg$/,
					loader: 'vue-svg-loader',
					options: {
							svgo: {
									plugins: [
											{ removeTitle: true },
											{ removeMetadata: true },
											{ removeDoctype: true },
											{ removeComments: true }
									]
							}
					}
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
						use: 'css-loader?minimize',
						fallback: 'vue-style-loader'
					})
			},
			{
        enforce: "pre",
        test: /\.(vue?|js)(\?.*)?$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      },
		]
	},
	performance: {
		maxEntrypointSize: 300000,
		hints: 'warning'
	},
	plugins: isProd ? [
		new VueLoaderPlugin(),
		// バンドルファイルを圧縮、最適化する。
		new webpack.optimize.UglifyJsPlugin({
				compress: {
						warnings: false
				},
				sourceMap: true,
				parallel: true
		}),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new ExtractTextPlugin({
				filename: 'common.[chunkhash].css'
		}),
		new webpack.HashedModuleIdsPlugin()
	] : [
			new webpack.optimize.UglifyJsPlugin({
				compress: { warnings: false }
			}),
			new webpack.optimize.ModuleConcatenationPlugin(),
			new ExtractTextPlugin({
				filename: 'common.[chunkhash].css'
			})
		]
};
