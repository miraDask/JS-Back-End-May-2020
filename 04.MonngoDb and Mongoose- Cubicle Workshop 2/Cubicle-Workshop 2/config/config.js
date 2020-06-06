module.exports = {
	development: {
		port: process.env.PORT || 3000,
		databaseUrl: `mongodb+srv://cubicalAdmin:${process.env
			.DB_PASSWORD}@marathon-mohdc.mongodb.net/cubicalDb?retryWrites=true&w=majority`
	},
	production: {}
};
