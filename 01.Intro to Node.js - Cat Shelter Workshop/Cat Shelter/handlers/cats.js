const url = require('url');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const formidable = require('formidable');
const cats = require('../data/cats.json');
const breeds = require('../data/breeds.json');

module.exports = (req, res) => {
	const pathName = url.parse(req.url).pathname;
	const catsFilePath = path.normalize(path.join(__dirname, '../views/addCat.html'));
	const breedsFilePath = path.normalize(path.join(__dirname, '../views/addBreed.html'));
	const breedsDataFilePath = path.normalize(path.join(__dirname, '../data/breeds.json'));

	if (pathName === '/cats/add-cat' && req.method === 'GET') {
		const stream = fs.createReadStream(catsFilePath);

		stream.on('data', (data) => {
			const breedsPlaceholder = breeds.map((x) => `<option value="${x}">${x}</option>`);
			const modifiedData = data.toString().replace('{{Breeds}}', breedsPlaceholder);
			res.write(modifiedData);
		});

		stream.on('end', () => {
			res.end();
		});

		stream.on('error', (err) => {
			console.log(err);
		});
	} else if (pathName === '/cats/add-cat' && req.method === 'POST') {
	} else if (pathName === '/cats/add-breed' && req.method === 'GET') {
		const stream = fs.createReadStream(breedsFilePath);

		stream.on('data', (data) => {
			res.write(data);
		});

		stream.on('end', () => {
			res.end();
		});

		stream.on('error', (err) => {
			console.log(err);
		});
	} else if (pathName === '/cats/add-breed' && req.method === 'POST') {
		let formData = '';
		req.on('data', (data) => {
			formData += data;
		});

		req.on('end', () => {
			const body = querystring.parse(formData);
			fs.readFile(breedsDataFilePath, (err, data) => {
				if (err) {
					console.log(err);
					return;
				}

				const breeds = JSON.parse(data);
				breeds.push(body.breed);
				const json = JSON.stringify(breeds);

				fs.writeFile(breedsDataFilePath, json, 'utf-8', () => console.log('breeds updated'));
			});

			res.writeHead(302, {
				Location: '/'
			});
			res.end();
		});

		req.on('error', (err) => {
			console.log(err);
		});
	} else {
		return true;
	}
};
