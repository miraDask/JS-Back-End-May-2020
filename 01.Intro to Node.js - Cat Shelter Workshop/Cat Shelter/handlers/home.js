const url = require('url');
const fs = require('fs');
const path = require('path');
const cats = require('../data/cats');

module.exports = (req, res) => {
	const pathName = url.parse(req.url).pathname;
	if (pathName === '/' && req.method === 'GET') {
		const filePath = path.normalize(path.join(__dirname, '../views/home/index.html'));
		fs.readFile(filePath, (err, data) => {
			if (err) {
				console.log(err);
				res.writeHead(404, {
					'Content-Type': 'text/plain'
				});

				res.write('Page Not Found');
				res.end();
				return;
			}

			res.writeHead(200, {
				'Content-Type': 'text/html'
			});

			res.write(data);
			res.end();
		});
	} else {
		return true;
	}
};
