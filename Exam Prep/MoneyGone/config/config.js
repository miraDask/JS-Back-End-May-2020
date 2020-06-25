module.exports = {
	development: {
		port: process.env.PORT,
		databaseUrl: process.env.DB_URL,
		secret: process.env.SECRET_KEY
	},
	production: {}
};
