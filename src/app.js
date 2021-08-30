/**
 * IMPORTS
 */
const express = require("express");
const bodyParser = require("body-parser");
/**
 * ROUTES
 */
const adminRoutes = require("./routes/admins");
const shopRoutes = require("./routes/shop");

/**
 * CONSTANTS
 */
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).send("<h1>Page not found</h1>");
});

app.listen(1337);
