const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// スタイル系のローダーを生成(vue-loaderオプションのloadersに使用)
// options:
//   sourceMap: ソースマップを出力するかどうか
//   extract: CSSファイルを外だしするかどうか
exports.cssLoaders = function(options) {
    options = options || {};

    const cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: process.env.NODE_ENV === 'production',
            sourceMap: options.sourceMap
        }
    };

    // ExtractTextPluginと一緒に使われるローダーを生成
    function generateLoaders(loader, loaderOptions) {
        const loaders = [cssLoader];
        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            });
        }

        // オプションがある場合CSSを別ファイルに外だしする(プロダクションビルド時)
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'vue-style-loader'
            });
        }
        return ['vue-style-loader'].concat(loaders);
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    };
};

// .vueファイル以外に書かれるスタイル系ローダーを生成(module.rulesに使用)
exports.styleLoaders = function(options) {
    const output = [];
    const loaders = exports.cssLoaders(options);
    for (const extension in loaders) {
        const loader = loaders[extension];
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        });
    }
    return output;
};
