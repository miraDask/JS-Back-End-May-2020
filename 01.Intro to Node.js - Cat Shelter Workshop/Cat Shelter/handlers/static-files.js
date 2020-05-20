const url = require('url');
const fs = require('fs');
const path = require('path');

function getContentType(url) {
	if (url.endsWith('css')) {
		return 'text/css';
	} else if (url.endsWith('js')) {
		return 'text/javascript';
	} else if (url.endsWith('png')) {
		return 'image/png';
	} else if (url.endsWith('ico')) {
		return 'image/vnd.microsoft.icon';
	}
}

module.exports = (req, res) => {
	const pathName = url.parse(req.url).pathname;

	if (pathName.startsWith('/content') && req.method === 'GET') {
		if (
			pathName.endsWith('jpg') ||
			pathName.endsWith('png') ||
			pathName.endsWith('jpeg') ||
			pathName.endsWith('ico')
		) {
			fs.readFile(`./${pathName}`, (err, data) => {
				if (err) {
					console.log(err);
					res.writeHead(404, {
						'Content-Type': 'text/plain'
					});

					res.write('Page not found!');
					res.end();
					return true;
				}

				console.log(pathName);
				res.writeHead(200, {
					'Content-Type': getContentType(pathName)
				});

				res.write(data);
				res.end();
			});
		} else {
			fs.readFile(`./${pathName}`, 'utf-8', (err, data) => {
				if (err) {
					console.log(err);
					res.writeHead(404, {
						'Content-Type': 'text/plain'
					});

					res.write('Page not found!');
					res.end();
					return true;
				}

				console.log(pathName);
				res.writeHead(200, {
					'Content-Type': getContentType(pathName)
				});

				res.write(data);
				res.end();
			});
		}
	} else {
		return true;
	}
};
