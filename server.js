const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const PORT = process.env.PORT || 8000; // default port 8080
const morgan = require('morgan');

app.set("view engine", "ejs");

// Set up console loggin for HTTP requests
app.use(morgan('combined'))

// Configure the session store
// secret: Secret encryption key that is used to create the
//         session key, stored as a cookie on the user's browser.
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

const WHITELISTED_PAGES = ["/", "/login"]
app.use((req, res, next) => {
  console.log("AUTHORIZING ", req.url);
  if(!WHITELISTED_PAGES.includes(req.url)) {
    const logged_in = req.session.user_id
    if(!logged_in) {
      res.redirect("/login")
    }
  }
  next();
})

app.use((req, res, next) => {
  console.log("!!!!!!!!!!!!!! OTHER MIDDLEWARE");
  next();
})

const userDatabase = [{ id: 1, name: "bob", password: 'tomato' }, { id: 2, name: 'shannon', password: 'dogs' }]

// parse application/x-www-form-urlencoded form data into req.body
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", (req, res) => {
  req.session.count = req.session.count ? req.session.count + 1 : 1

  // render the views/login.ejs file
  res.render("login", { view_count: req.session.count })
});

// const userDatabase = [{ name: "bob", password: 'tomato' }, { name: 'shannon', password: 'dogs' }]
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // var user;
  // userDatabase.forEach((userObj) => {
  //   if(userObj.name === username) {
  //     user = userObj
  //   }
  // })
  // function isBigEnough(element) {
  //   return element >= 15;
  // }
  //
  // [12, 5, 8, 130, 44].find(isBigEnough); // 130
  // const user = userDatabase.find(function(userObj) {
  //   return userObj.name === username && userObj.password === password;
  // })
  // Refactor to ES6
  const user = userDatabase.find((userObj) =>{
    return userObj.name === username && userObj.password === password;
  })
  if(user) {
    req.session.user_id = user.id;
    res.redirect("/secret")
  } else {
    res.redirect("/")
  }
})

app.get("/login", (req, res) => {
  res.render("login");
});


app.get("/secret", (req, res) => {
  // render the views/secret.ejs file
  res.render("secret")
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
