/* eslint-disable no-console */
const http = require('http');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const compression = require('compression');

const api = require('./private/routes');
const app = express();
const httpServer = http.createServer(app);

serveAPI();

searchAPI();

exceptionsAPI();

httpServer.listen(8080);

function serveAPI(){

	app.use(compression());
	app.set('view engine', 'html');
	app.set('views', `${__dirname}/public/`);
	app.engine('html', ejs.renderFile);

	app.get('/', async (req, res) => {

		const results = JSON.stringify(await api.Products.fetch.call(api.Products));
		const currencies = JSON.stringify(await api.Rates.fetch.call(api.Rates));
		const history = JSON.stringify(await api.History.fetch.call(api.History));
		const favicon = fs.readFileSync(`${__dirname}/public/dev/img/favicon.png`, 'base64');

		res.render('index', {
			results, currencies, history, favicon
		});

	});

	app.use([ /^\/dev($|\/)/, '/' ], express.static(`${__dirname}/public/`));

}

function searchAPI(){

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.post('/api/check', (req, res) => {

		api.History.save.call(api.History, req);

		api.Search.check.call(api.Search, req, res);

	});

}

function exceptionsAPI(){

	app.use((req, res, next) => {

		const errStatus = 404;

		res.status(errStatus);

		res.send(`<h1>${errStatus}: Page not Found</h1>`);

		next();

	});

	app.use((err, req, res, next) => {

		if(process.env.ENV_MODE === 'prod'){ api.logError(err); }

		const errStatus = err.status || 500;

		res.status(errStatus);

		res.send(`<h1>${errStatus}: Internal Server Error</h1>`);

		next();
	});

	if(process.env.ENV_MODE === 'prod'){

		setInterval(() => { http.get(`http://hc-ping.com/${process.env.KEY_HC}`); }, 4 * 60 * 1000);

		process.on('uncaughtException', api.logError);

		process.on('unhandledRejection', api.logError);

	}

}