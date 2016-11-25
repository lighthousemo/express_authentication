var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var PORT = process.env.PORT || 8000; // default port 8080

app.set("view engine", "ejs");

// parse application/x-www-form-urlencoded form data into req.body
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", (req, res) => {
  // render the views/login.ejs file
  res.render("login")
});

app.get("/secret", (req, res) => {
  // render the views/secret.ejs file
  res.render("secret")
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
