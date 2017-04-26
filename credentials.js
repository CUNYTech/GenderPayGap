module.exports = {
	cookieSecret: process.env.COOKIE_SECRET,
	mongoUrl: process.env.MONGO_URI,
	secretKey: process.env.MONGO_SECRET_KEY,
	mongo: {
		development:{
			connectionString: process.env.MONGO_URI,
		},
		production:{
			connectionString: process.env.MONGO_URI,
		},
	},
	email: {
		provider: 'Gmail',
		user: process.env.GMAIL_USER,
		password: process.env.GMAIL_PASS,
	},
}