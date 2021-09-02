const path = require("path");
const express = require("express");
const rootDir = require("../utils/path");
const router = express.Router();
const adminData = require("./admins");

router.get("/", (req, res, next) => {
  const products = adminData.products;
  res.render("shop", { prods: products, pageTitle: "Shop", path: "/" });
});

module.exports = router;
