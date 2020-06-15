const express = require('express');
const cookieParser = require('cookie-parser');
const handlebars = require('express-handlebars');
const { authenticationCheck } = require('../controllers/auth');

module.exports = (app) => {
	app.use(cookieParser());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.engine(
		'.hbs',
		handlebars({
			extname: '.hbs'
		})
	);

	app.set('view engine', '.hbs');

	app.use('/static', express.static('static'));
	app.use(authenticationCheck);
};
