const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');

const homePageRoute = require('./routes/home');
const catsRoute = require('./routes/cats');

const app = express();
const PORT = 3232;

app.use(express.static(path.join(__dirname, 'public')));
app.engine(
	'.hbs',
	handlebars({
		extname: '.hbs',
		defaultView: 'main'
	})
);

app.set('view engine', '.hbs');

app.use('/', homePageRoute);
app.use('/cats', catsRoute);

app.listen(PORT, () => console.log(`Server is listening on post: ${PORT}`));
