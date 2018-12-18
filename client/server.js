'use strict';

const express = require('express');
const LRU = require('lru-cache');
const fs = require('fs');
const path = require('path');
const { createBundleRenderer } = require('vue-server-renderer');
const bundle = require('./dist/vue-ssr-server-bundle.json');
const setupDevServer = require('./config/setup-dev-server');
const PORT = 8081;

const isProd = process.env.NODE_ENV === 'production';

const server = express();

server.use('/dist', express.static(path.resolve(__dirname, './dist')));
server.use('/static', express.static(path.resolve(__dirname, './static')));
server.use('/manifest.json', express.static(path.resolve(__dirname, './manifest.json')));
server.use('/service-worker.js', express.static(path.resolve(__dirname, './dist/service-worker.js')));

function createRenderer(bundle, options) {
    return createBundleRenderer(bundle, {
        ...options,
        cache: LRU({
            max: 1000,
            maxAge: 1000 * 60 * 15
        }),
        basedir: './dist',
        // パフォーマンス向上のため、BundleRendererの描画ごとにコンテキストを生成しないようにする。
        runInNewContext: 'once'
    });
}

let renderer;
const templatePath = './src/index.template.html';
if (isProd) {
    const template = fs.readFileSync(templatePath, 'utf-8');
    const bundle = require('./dist/vue-ssr-server-bundle.json');
    const clientManifest = require('./dist/vue-ssr-client-manifest.json');
    renderer = createRenderer(bundle, {
        template,
        clientManifest
    });
} else {
    setupDevServer(server, templatePath, (bundle, options) => {
        renderer = createRenderer(bundle, options);
    });
}




server.get('*', (req, res) => {

	res.setHeader("Content-Type", "text/html");

	const context = {
		url: req.url,
		title: "Vue Ssr Sample"
	};

	renderer.renderToString(context, (err, html) => {
		if(err){
			if(err.code === 404){
				res.status(400).send('Not found');
			} else {
				res.status(500).send('Internal server error');
			}
      console.log(err);
		} else {
			res.send(html);
		}
	});
});

const port = PORT || 3000;

server.listen(port, () => {
	console.log("Server started on port "+port);
});
