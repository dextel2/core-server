const mongodb = require("mongodb");
const getDb = require("../utils/database").getDb;

const ObjectId = mongodb.ObjectId;

class User {
	constructor(username, email, cart, id) {
		this.name = username;
		this.email = email;
		this.cart = cart;
		this._id = id;
	}

	save() {
		const db = getDb();
		return db.collection("users").insertOne(this);
	}

	addToCart(product) {
		// const cartProduct = this.cart.items.findIndex(cp=>{
		// 	return cp._id === product._id
		// })

		const updatedCart = { items: [{ ...product, quantity: 1 }] };
		const db = getDb();
		return db
			.collection("users")
			.updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: updatedCart } });
	}

	static findById(userId) {
		const db = getDb();
		return db
			.collection("users")
			.find({ _id: new ObjectId(userId) })
			.next()
			.then((user) => {
				return user;
			})
			.catch((err) => {
				console.log(err);
			});
	}
}

module.exports = User;
