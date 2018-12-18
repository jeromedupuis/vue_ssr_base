const merge = require("webpack-merge");
const webpack = require("webpack");
const baseConfig = require("./webpack.base.config");
const SWPrecachePlugin = require('sw-precache-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

const env = require('../env/dev.env');

const isProd = process.env.NODE_ENV === 'production';

const config = merge(baseConfig, {
	entry: {
		app: './src/entry-client.js'
	},
	resolve: {
		alias: {
			'axios-client': './axios-client.js'
		}
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': env
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function (module) {
				return (
					/node_modules/.test(module.context) &&
					!/\.css$/.test(module.request)
				)
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest'
		}),
		new VueSSRClientPlugin()
	]
});

if (isProd) {
    config.plugins.push(
        // サービスワーカーを自動生成する
        new SWPrecachePlugin({
						cacheId: 'vue-ssr-sample',
						filename: 'service-worker.js',
            minify: true,
            dontCacheBustUrlsMatching: /./,
            staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
            runtimeCaching: [
                {
                    urlPattern: '/',
                    handler: 'networkFirst'
                }
            ]
        })
    );
}

module.exports = config;
