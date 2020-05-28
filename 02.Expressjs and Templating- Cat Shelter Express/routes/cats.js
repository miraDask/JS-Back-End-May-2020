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

const getCurrentCat = async (catId) => {
	const data = await getAllCats();
	const cat = data.filter((cat) => cat.id == catId)[0];
	return cat;
};

const deleteCat = async (catId) => {
	const catsAll = await getAllCats();
	const allWithoutDeletedCat = catsAll.filter((x) => x.id != catId);
	const json = JSON.stringify(allWithoutDeletedCat);

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
			return;
		}

		const oldPath = files.upload.path;
		const newPath = path.normalize(path.join(appPath, '/public/images/' + files.upload.name));

		mv(oldPath, newPath, (err) => {
			if (err) {
				console.log(err);
				return;
			}
			console.log('File is uploaded successfully!');
		});

		let catsAll = await getAllCats();

		catsAll.push({
			id: catsAll.length + 1,
			image: files.upload.name,
			...fields
		});

		const json = JSON.stringify(catsAll);

		try {
			const result = await writeFile(catsDataFilePath, json, 'utf-8');
			res.redirect(302, '/');
		} catch (err) {
			console.error(err.message);
			return;
		}
	});
});

route.get('/find-new-home/:id', async (req, res) => {
	const cat = await getCurrentCat(req.params.id);
	res.render('cat-shelter', { cat });
});

route.post('/find-new-home/:id', async (req, res) => {
	const catId = req.params.id;
	await deleteCat(catId);
	res.redirect(302, '/');
});

route.get('/edit/:id', getBreeds, async (req, res) => {
	const cat = await getCurrentCat(req.params.id);
	const breeds = req.breeds.filter((x) => x != cat.breed);
	res.render('cat-edit', { cat, breeds });
});

route.post('/edit/:id', async (req, res) => {
	const form = new formidable.IncomingForm();
	const catId = req.params.id;

	form.parse(req, async (err, fields, files) => {
		if (err) {
			return console.log(err.message);
		}

		if (files.upload.name) {
			const oldPath = files.upload.path;
			const newPath = path.normalize(path.join(appPath, '/public/images/' + files.upload.name));
			mv(oldPath, newPath, (err) => {
				if (err) {
					console.log(err);
					return;
				}
				console.log('File is uploaded successfully!');
			});
		}

		let catsAll = await getAllCats();
		const catIndex = catsAll.findIndex((x) => x.id == catId);
		const cat = catsAll[catIndex];
		const editedCat = {
			id: cat.id,
			image: files.upload.name ? files.upload.name : cat.image,
			...fields
		};

		catsAll[catIndex] = editedCat;
		const json = JSON.stringify(catsAll);

		try {
			const result = await writeFile(catsDataFilePath, json, 'utf-8');
			res.redirect(302, '/');
		} catch (err) {
			return console.log(err.message);
		}
	});
});

route.get('/add-breed', (req, res) => {
	res.render('add-breed');
});

route.post('/add-breed', getBreeds, async (req, res) => {
	let breeds = req.breeds;
	const breed = req.body.breed;
	breeds.push(breed);
	const json = JSON.stringify(breeds);

	try {
		const result = await writeFile(breedsDataFilePath, json, 'utf-8');
		res.redirect(302, '/');
	} catch (err) {
		return console.log(err.message);
	}
});

module.exports = route;
