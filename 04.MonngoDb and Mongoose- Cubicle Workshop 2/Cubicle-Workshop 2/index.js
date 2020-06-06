const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];

const connectionString = config.databaseUrl;
const mongoose = require('mongoose');

const app = require('express')();

mongoose.connect(connectionString, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
	if (err) {
		console.error(err);
		throw err;
	}

	console.log('DB is connected and ready to go...');
});

require('./config/express')(app);
require('./config/routes')(app);

app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));
