const http = require('http');
const path = require('path');
const PORT = '3232';

const handlers = require('./handlers');
global.appPath = path.resolve(__dirname);

const server = http.createServer((req, res) => {
	for (const handler of handlers) {
		if (!handler(req, res)) {
			break;
		}
	}
});

server.listen(PORT);
