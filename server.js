const path = require("path");
const mongoConnect = require("./src/utils/database").mongoConnect;
const port = process.env.PORT || 5000;
const express = require("express");
const bodyParser = require("body-parser");
const User = require("./src/models/user");
const errorController = require("./src/controllers/error");
const multer = require("multer");
const storage = multer.memoryStorage();
const uploads = multer({ storage });
const sharp = require("sharp");
const fs = require("fs");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/src/views"));

const adminRoutes = require("./src/routes/admin");
const shopRoutes = require("./src/routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/src/public")));

app.use((req, res, next) => {
	User.findById("615490961edaa81fdda5f2c7")
		.then((user) => {
			req.user = new User(user.name, user.email, user.cart, user._id);
			next();
		})
		.catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.post("/api/v1/images", uploads.single("thumbnail"), async (req, res) => {
	console.log("file", req.file);
	console.log("body", req.body);
	fs.access("./data/uploads/", (err) => {
		if (err) {
			fs.mkdirSync("./data/uploads");
		}
	});
	await sharp(req.file.buffer)
		.resize({ width: 650, height: 350 })
		.toFile("./data/uploads/" + req.file.originalname);
	res.send("success");
});

app.use(errorController.get404);

mongoConnect(() => {
	app.listen(port, () => {
		console.log(`server is running on ${port}`);
	});
});
