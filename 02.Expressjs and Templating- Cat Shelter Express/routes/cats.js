const express = require('express');
const route = express.Router();
const fs = require('fs');
const mv = require('mv');
const formidable = require('formidable');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const path = require('path');
const breedsDataFilePath = path.normalize(path.join(__dirname, '../data/breeds.json'));
const catsDataFilePath = path.normalize(path.join(__dirname, '../data/cats.json'));

const getBreeds = (req, res, next) => {
	fs.readFile(breedsDataFilePath, (err, data) => {
		if (err) {
			console.log(err.message);
			return;
		}

		req.breeds = JSON.parse(data);
		next();
	});
};

const getAllCats = async () => {
	const catsDataFilePath = path.normalize(path.join(__dirname, '../data/cats.json'));
	const data = await readFile(catsDataFilePath);
	if (!data) {
		console.log('error: reading file');
		return;
	}

	return JSON.parse(data);
};

const createNewCat = async (fileName, ...fields) => {
	let catsAll = await getAllCats();

	catsAll.push({
		id: catsAll.length + 1,
		image: fileName,
		...fields
	});

	const json = JSON.stringify(catsAll);

	try {
		await writeFile(catsDataFilePath, json, 'utf-8');
	} catch (err) {
		console.log(err.message);
	}

	return console.log('cats updated');
};

route.get('/add-cat', getBreeds, (req, res) => {
	res.render('add-cat', { breeds: req.breeds, layout: 'main' });
});

route.post('/add-cat', (req, res) => {
	let form = new formidable.IncomingForm();

	form.parse(req, async (err, fields, files) => {
		if (err) {
			console.log(err);
			return true;
		}

		const oldPath = files.upload.path;
		const newPath = path.normalize(path.join(appPath, '/public/images/' + files.upload.name));

		mv(oldPath, newPath, (err) => {
			if (err) {
				console.log(err);
				return true;
			}
			console.log('File is uploaded successfully!');
		});

		await createNewCat(files.upload.name, ...fields);

		res.writeHead(302, {
			Location: '/'
		});
		res.end();
	});
});

module.exports = route;
