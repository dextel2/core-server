const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
	MongoClient.connect(
		"mongodb+srv://karankeyash:5iQjbOd5VsALNtKL@core-server-nosql.62k6j.mongodb.net/shop?retryWrites=true&w=majority"
	)
		.then((client) => {
			_db = client.db("");
			callback();
		})
		.catch((err) => {
			throw new Error("An Error Occured");
		});
};

const getDb = () => {
	if (_db) {
		return _db;
	} else {
		throw new Error("No Database found");
	}
};
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
