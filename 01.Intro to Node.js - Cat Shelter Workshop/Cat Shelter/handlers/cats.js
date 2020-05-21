const url = require('url');
const fs = require('fs');
const mv = require('mv');
const path = require('path');
const querystring = require('querystring');
const formidable = require('formidable');
const cats = require('../data/cats.json');
const breeds = require('../data/breeds.json');

const addCatFilePath = path.normalize(path.join(__dirname, '../views/addCat.html'));
const catsEditFilePath = path.normalize(path.join(__dirname, '../views/editCat.html'));

const breedsFilePath = path.normalize(path.join(__dirname, '../views/addBreed.html'));
const breedsDataFilePath = path.normalize(path.join(__dirname, '../data/breeds.json'));
const catsDataFilePath = path.normalize(path.join(__dirname, '../data/cats.json'));
const catShelterFilePath = path.normalize(path.join(__dirname, '../views/catShelter.html'));

const getCurrentCatId = (pathName) => {
	const splittedPathName = pathName.split('/');
	return splittedPathName[splittedPathName.length - 1];
};

module.exports = async (req, res) => {
	const pathName = url.parse(req.url).pathname;

	if (pathName === '/cats/add-cat' && req.method === 'GET') {
		const stream = fs.createReadStream(addCatFilePath);

		stream.on('data', (data) => {
			fs.readFile(breedsDataFilePath, (err, breedsData) => {
				if (err) {
					console.log(err);
					return;
				}

				const breeds = JSON.parse(breedsData);
				const breedsPlaceholder = breeds.map((x) => `<option value="${x}">${x}</option>`);
				const modifiedData = data.toString().replace('{{Breeds}}', breedsPlaceholder);
				res.write(modifiedData);
				res.end();
			});
		});

		stream.on('error', (err) => {
			console.log(err);
		});
	} else if (pathName === '/cats/add-cat' && req.method === 'POST') {
		let form = new formidable.IncomingForm();

		form.parse(req, (err, fields, files) => {
			if (err) {
				console.log(err);
				return true;
			}

			const oldPath = files.upload.path;
			const newPath = path.normalize(path.join(appPath, '/content/images/' + files.upload.name));

			mv(oldPath, newPath, (err) => {
				if (err) {
					console.log(err);
					return true;
				}

				console.log('File is uploaded successfully!');
			});

			fs.readFile(catsDataFilePath, (err, data) => {
				if (err) {
					console.log(err);
					return;
				}

				const catsAll = JSON.parse(data);
				catsAll.push({
					id: catsAll.length + 1,
					image: files.upload.name,
					...fields
				});

				const json = JSON.stringify(catsAll);

				fs.writeFile(catsDataFilePath, json, 'utf-8', () => {
					console.log('cats updated');
					res.writeHead(302, {
						Location: '/'
					});
					res.end();
				});
			});
		});
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

				fs.writeFile(breedsDataFilePath, json, 'utf-8', () => {
					console.log('breeds updated');
					res.writeHead(302, {
						Location: '/'
					});
					res.end();
				});
			});
		});

		req.on('error', (err) => {
			console.log(err);
		});
	} else if (pathName.includes('/cats-edit') && req.method === 'GET') {
		const stream = fs.createReadStream(catsEditFilePath);

		stream.on('data', (data) => {
			fs.readFile(catsDataFilePath, (err, catsData) => {
				if (err) {
					console.log(err);
					return;
				}

				let cats = JSON.parse(catsData);
				const cat = cats.filter((x) => x.id == getCurrentCatId(pathName))[0];

				fs.readFile(breedsDataFilePath, (err, breedsData) => {
					if (err) {
						console.log(err);
						return;
					}

					const breeds = JSON.parse(breedsData);
					const breedsPlaceholder = breeds.map((x) => `<option value="${x}">${x}</option>`);
					let modifiedData = data.toString().replace('{{Breeds}}', breedsPlaceholder);
					modifiedData = modifiedData.replace('{{id}}', cat.id);
					modifiedData = modifiedData.replace('{{catName}}', cat.name);
					modifiedData = modifiedData.replace('{{catDescription}}', cat.description);
					res.write(modifiedData);
					res.end();
				});
			});
		});

		req.on('error', (err) => {
			console.log(err);
		});
	} else if (pathName.includes('/cats-edit') && req.method === 'POST') {
		let form = new formidable.IncomingForm();

		form.parse(req, (err, fields, files) => {
			if (err) {
				console.log(err);
				return true;
			}

			if (files.upload.name) {
				const oldPath = files.upload.path;
				const newPath = path.normalize(path.join(appPath, '/content/images/' + files.upload.name));

				mv(oldPath, newPath, (err) => {
					if (err) {
						console.log(err);
						return true;
					}

					console.log('File is uploaded successfully!');
				});
			}

			fs.readFile(catsDataFilePath, (err, data) => {
				if (err) {
					console.log(err);
					return;
				}

				const catId = getCurrentCatId(pathName);
				const catsAll = JSON.parse(data);
				const catIndex = catsAll.findIndex((x) => x.id == catId);
				let cat = catsAll[catIndex];
				const editedCat = {
					id: cat.id,
					image: files.upload.name ? files.upload.name : cat.image,
					...fields
				};

				catsAll[catIndex] = editedCat;

				const json = JSON.stringify(catsAll);

				fs.writeFile(catsDataFilePath, json, 'utf-8', () => {
					console.log('cats updated');
					res.writeHead(302, {
						Location: '/'
					});
					res.end();
				});
			});
		});
	} else if (pathName.includes('/cats-find-new-home') && req.method === 'GET') {
		const cat = cats.filter((x) => x.id == getCurrentCatId(pathName))[0];

		const stream = fs.createReadStream(catShelterFilePath);

		stream.on('data', (data) => {
			const imageSrc = path.join('../content/images/' + cat.image);
			let modifiedData = data
				.toString()
				.replace('{{Breed}}', `<option value="${cat.breed}">${cat.breed}</option>`);
			modifiedData = modifiedData.replace('{{imageSrc}}', imageSrc);
			modifiedData = modifiedData.replace('{{id}}', cat.id);
			modifiedData = modifiedData.replace('{{catName}}', cat.name);
			modifiedData = modifiedData.replace('{{catDescription}}', cat.description);

			res.write(modifiedData);
		});

		stream.on('end', () => {
			res.end();
		});

		stream.on('error', (err) => {
			console.log(err);
		});
	} else if (pathName.includes('/cats-find-new-home') && req.method === 'POST') {
		const catId = getCurrentCatId(pathName);
		fs.readFile(catsDataFilePath, (err, data) => {
			if (err) {
				console.log(err);
				return;
			}

			let catsAll = JSON.parse(data);
			catsAll = catsAll.filter((x) => x.id != catId);
			const json = JSON.stringify(catsAll);

			fs.writeFile(catsDataFilePath, json, 'utf-8', () => {
				console.log('cats updated');
				res.writeHead(302, {
					Location: '/'
				});
				res.end();
			});
		});
	} else {
		return true;
	}
};
