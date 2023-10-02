import bodyParser from "body-parser";
import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import { get404 } from "./src/controllers/error";
import User from "./src/models/user";
import adminRoutes from "./src/routes/admin";
import shopRoutes from "./src/routes/shop";
import { mongoConnect } from "./src/utils/database";
const storage = multer.memoryStorage();
const uploads = multer({ storage });
const port = process.env.PORT || 1337;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/src/views"));

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
  fs.access("./src/data/uploads/", (err) => {
    if (err) {
      fs.mkdirSync("./data/uploads");
    }
  });
  await sharp(req.file.buffer)
    .resize({ width: 650, height: 350 })
    .toFile("./src/data/uploads/" + req.file.originalname);
  res.send("success");
});

app.use(get404);

mongoConnect(() => {
  app.listen(port, () => {
    console.log(`server is running on ${port}`);
  });
});
