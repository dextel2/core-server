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

	login(email, password) {
		const db = getDb();
		return db
			.collection("users")
			.findOne({ email: email })
			.then((user) => {
				if (!user) {
					return Promise.reject("User not found");
				}
				return bcrypt.compare(password, user.password).then((res) => {
					if (res) {
						return Promise.resolve(user);
					}
					return Promise.reject("Wrong password");
				});
			});
	}

	save() {
		const db = getDb();
		return db.collection("users").insertOne(this);
	}

	/**
	 * Create register api
	 */
	static register(username, email, password) {
		const db = getDb();
		const user = new User(username, email, [], new ObjectId());
		return db
			.collection("users")
			.findOne({ email: email })
			.then((user) => {
				if (user) {
					return Promise.reject("Email already exists");
				}
				return bcrypt.hash(password, 12).then((hash) => {
					user.password = hash;
					return db.collection("users").insertOne(user);
				}).then(() => {
					return user;
				});
			});
	}
}


addToCart(product) {
	const cartProductIndex = this.cart.items.findIndex((cp) => {
		return cp.productId.toString() === product._id.toString();
	});

	let newQuantity = 1;
	const updatedCartItems = [...this.cart.items];

	if (cartProductIndex >= 0) {
		newQuantity = this.cart.items[cartProductIndex].quantity + 1;
		updatedCartItems[cartProductIndex].quantity = newQuantity;
	} else {
		updatedCartItems.push({
			productId: new ObjectId(product._id),
			quantity: newQuantity,
		});
	}
	const updatedCart = {
		items: updatedCartItems,
	};
	const db = getDb();
	return db.collection("users").updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
}

getCart() {
	const db = getDb();
	const productIds = this.cart.items.map((el) => {
		return el.productId;
	});
	return db
		.collection("products")
		.find({ _id: { $in: productIds } })
		.toArray()
		.then((products) => {
			return products.map((product) => {
				return {
					...product,
					quantity: this.cart.items.find((i) => {
						return i.productId.toString() === product._id.toString();
					}).quantity,
				};
			});
		});
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
