const path = require("path");
// const User = require("./models/user");
const mongoConnect = require("./utils/database").mongoConnect;

const express = require("express");
const bodyParser = require("body-parser");
const User = require("./models/user");
const errorController = require("./controllers/error");
const multer = require("multer");
const storage = multer.memoryStorage();
const uploads = multer({ storage });
const sharp = require("sharp");
const fs = require("fs");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
    User.findById("615490961edaa81fdda5f2c7")
        .then((user) => {
            req.user = user;
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
const port = process.env.PORT || 5000;

mongoConnect(() => {
    app.listen(port, () => {
        console.log(`server is running on ${port}`);
    });
});
