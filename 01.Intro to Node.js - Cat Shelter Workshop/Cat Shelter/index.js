const http = require('http');
const PORT = '3232';

const handlers = require('./handlers');

const server = http.createServer((req, res) => {
	for (const handler of handlers) {
		if (!handler(req, res)) {
			break;
		}
	}
});

server.listen(PORT);
