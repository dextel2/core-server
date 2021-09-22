const path = require("path");
const sequelize = require("./utils/database");
const express = require("express");
const bodyParser = require("body-parser");

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
const port = process.env.port || 5000;

sequelize
  .sync()
  .then((res) => {})
  .catch((err) => console.error(err));

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
