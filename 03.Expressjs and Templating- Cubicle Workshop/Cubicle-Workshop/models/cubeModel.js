const uniqId = require('uniqid');
const fs = require('fs');
const path = require('path');

const dataPath = path.normalize(path.join(__dirname, '../config/database.json'));

class CubeModel {
	constructor() {
		this.data = require('../config/database.json');
	}

	_read() {
		return new Promise((resolve, reject) => {
			fs.readFile(dataPath, (err, data) => {
				if (err) {
					console.log(err);
					reject(err);
					return;
				}

				resolve(JSON.parse(data));
			});
		});
	}

	_write(newData) {
		return new Promise((resolve, reject) => {
			fs.writeFile(dataPath, JSON.stringify(newData), (err) => {
				if (err) {
					reject(err);
					return;
				}

				this.data = newData;
				resolve(console.log('Database is updated'));
			});
		});
	}

	async create(name, description, imageUrl, difficulty) {
		const newCube = {
			id: uniqId(),
			name,
			description,
			imageUrl,
			difficulty: +difficulty
		};

		try {
			const cubesAll = await this.getAll();
			cubesAll.push(newCube);
			return this._write(cubesAll);
		} catch (error) {
			console.log(error);
		}
	}

	async getAll() {
		try {
			return await this._read();
		} catch (error) {
			console.log(error);
		}
	}

	async getById(id) {
		try {
			const cubesAll = await this.getAll();
			const cube = cubesAll.filter((x) => x.id === id)[0];
			console.log(cube);
			return cube;
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = new CubeModel();
