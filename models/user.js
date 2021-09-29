const mongodb = require("mongodb");
const getDb = require("../utils/database").getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email) {
        this.name = username;
        this.email = email;
    }

    save() {
        const db = getDb();
        return db.collection("users").insertOne(this);
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
