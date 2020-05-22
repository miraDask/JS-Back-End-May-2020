const url = require('url');
const fs = require('fs');
const path = require('path');

const catsDataFilePath = path.normalize(path.join(__dirname, '../data/cats.json'));

module.exports = (req, res) => {
	const pathName = url.parse(req.url).pathname;
	if ((pathName === '/' || pathName === '/search') && req.method === 'GET') {
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
			fs.readFile(catsDataFilePath, (err, catsData) => {
				if (err) {
					console.log(err);
					return;
				}

				let cats = JSON.parse(catsData);

				const query = url.parse(req.url, true).query;
				if (pathName === '/search' && query.text) {
					const text = query.text.toLowerCase();
					cats = cats.filter(
						(x) => x.name.toLowerCase().includes(text) || x.description.toLowerCase().includes(text)
					);
				}

				const modifiedCats = cats.map(
					(cat) =>
						`<li>
					<img src="${path.join('../content/images/' + cat.image)}" alt="${cat.name}">
					<h3>${cat.name}</h3>
					<p><span>Breed: </span>${cat.breed}</p>
					<p><span>Description: </span>${cat.description}</p>
					<ul class="buttons">
						<li class="btn edit"><a href="/cats-edit/${cat.id}">Change Info</a></li>
						<li class="btn delete"><a href="/cats-find-new-home/${cat.id}">New Home</a></li>
					</ul>
				</li>`
				);
				const modifiedData = data.toString().replace(catsPlaceHolder, modifiedCats);
				res.write(modifiedData);
				res.end();
			});
		});
	} else {
		return true;
	}
};
