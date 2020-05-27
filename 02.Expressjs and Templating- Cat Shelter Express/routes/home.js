const express = require('express');
const fs = require('fs');
const path = require('path');

const route = express.Router();

const getCats = (req, res, next) => {
	const catsDataFilePath = path.normalize(path.join(__dirname, '../data/cats.json'));

	fs.readFile(catsDataFilePath, (err, data) => {
		if (err) {
			console.log(err.message);
			return;
		}

		req.cats = JSON.parse(data);
		next();
	});
};

route.get('/', getCats, (req, res) => {
	const searchText = req.query.searchText;
	if (searchText) {
		req.cats = req.cats.filter(
			(cat) =>
				cat.name.toLowerCase().includes(searchText.toLowerCase()) ||
				cat.description.toLowerCase().includes(searchText.toLowerCase())
		);
	}

	res.render('home', { cats: req.cats });
});

module.exports = route;
