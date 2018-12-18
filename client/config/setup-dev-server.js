const fs = require('fs');
const path = require('path');
const MFS = require('memory-fs');
const webpack = require('webpack');
const chokidar = require('chokidar');
const clientConfig = require('./webpack.client.config');
const serverConfig = require('./webpack.server.config');

const readFile = (fs, file) => {
    try {
        return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8');
    } catch (e) {}
};

module.exports = function setupDevServer(app, templatePath, cb) {
    let bundle;
    let template;
    let clientManifest;

    let resolve;
    const readyPromise = new Promise((r) => {
        resolve = r;
    });
    
    const update = () => {
        if (bundle && clientManifest) {
            resolve();
            cb(bundle, {
                template,
                clientManifest
            });
        }
    };

    template = fs.readFileSync(templatePath, 'utf-8');
    chokidar.watch(templatePath).on('change', () => {
        template = fs.readFileSync(templatePath, 'utf-8');
        console.log('index.html template updated.');
        update();
    });

    clientConfig.output.filename = '[name].js';
    clientConfig.plugins.push(
        new webpack.NoEmitOnErrorsPlugin()
    );

    const clientCompiler = webpack(clientConfig);
    const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        noInfo: true
    });
    app.use(devMiddleware);
    clientCompiler.plugin('done', (stats) => {
        stats = stats.toJson();
        stats.errors.forEach((err) => console.error(err));
        stats.warnings.forEach((err) => console.warn(err));
        if (stats.errors.length) return;
        clientManifest = JSON.parse(readFile(devMiddleware.fileSystem, 'vue-ssr-client-manifest.json'));
        update();
    });

    const serverCompiler = webpack(serverConfig);
    const mfs = new MFS();
    serverCompiler.outputFileSystem = mfs;
    serverCompiler.watch({}, (err, stats) => {
        if (err) throw err;
        stats = stats.toJson();
        if (stats.errors.length) return;

        // vue-ssr-webpack-pluginによって生成されたbundleを読み込む
        bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'));
        update();
    });

    return readyPromise;
};
