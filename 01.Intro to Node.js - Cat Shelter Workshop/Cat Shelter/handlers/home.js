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

			const catsPlaceHolder = '{{Cats}}';
			const modifiedCats = cats.map(
				(cat) =>
					`<li>
				<img src="${path.join('../content/images/' + cat.image)}" alt="${cat.name}">
				<h3>${cat.name}</h3>
				<p><span>Breed: </span>${cat.breed}</p>
				<p><span>Description: </span>${cat.description}</p>
				<ul class="buttons">
					<li class="btn edit"><a href="">Change Info</a></li>
					<li class="btn delete"><a href="">New Home</a></li>
				</ul>
			</li>`
			);
			const modifiedData = data.toString().replace(catsPlaceHolder, modifiedCats);
			res.write(modifiedData);
			res.end();
		});
	} else {
		return true;
	}
};
