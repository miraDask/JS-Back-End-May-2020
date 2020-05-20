const url = require('url');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const formidable = require('formidable');
const cats = require('../data/cats.json');
const breeds = require('../data/breeds.json');

const createStreamForGet = (filePath, res) => {
	const stream = fs.createReadStream(filePath);

	stream.on('data', (data) => {
		res.write(data);
	});

	stream.on('end', () => {
		res.end();
	});

	stream.on('error', (err) => {
		console.log(err);
	});
};

module.exports = (req, res) => {
	const pathName = url.parse(req.url).pathname;
	const catsFilePath = path.normalize(path.join(__dirname, '../views/addCat.html'));
	const breedsFilePath = path.normalize(path.join(__dirname, '../views/addBreed.html'));

	if (pathName === '/cats/add-cat' && req.method === 'GET') {
		createStreamForGet(catsFilePath, res);
	} else if (pathName === '/cats/add-cat' && req.method === 'POST') {
	} else if (pathName === '/cats/add-breed' && req.method === 'GET') {
		createStreamForGet(breedsFilePath, res);
	} else if (pathName === '/cats/add-breed' && req.method === 'POST') {
		let formData = '';
		req.on('data', (data) => {
			formData += data;
		});

		req.on('end', () => {
			const body = querystring.parse(formData);
			const breedsDataFilePath = path.normalize(path.join(__dirname, '../data/breeds.json'));
			fs.readFile(breedsDataFilePath, (err, data) => {
				if (err) {
					console.log(err);
					return;
				}

				const breeds = JSON.parse(data);
				breeds.push(body.breed);
				const json = JSON.stringify(breeds);

				fs.writeFile(breedsDataFilePath, json, () => console.log('breeds updated'));
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
