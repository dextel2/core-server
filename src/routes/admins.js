const express = require("express");

const router = express.Router();

router.get("/add-product", (req, res, next) => res.send("<form action='/product' method='POST'> <input type='text' name='title'/> <button type='submit'>Submit</button></form>"));

router.post("/product", (req, res, next) => res.redirect("/"));

module.exports = router;
