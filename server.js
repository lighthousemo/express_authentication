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

// Middleware run in the order that they are defined.
app.use((req, res, next) => {
  console.log("!!!!!!!!!!!!!! OTHER MIDDLEWARE");
  next();
})

// Our fake user database.
// In a real application we would use hashed passwords and a real database.
const userDatabase = [{ id: 1, name: "bob", password: 'tomato' }, { id: 2, name: 'shannon', password: 'dogs' }]

// parse application/x-www-form-urlencoded form data into req.body
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", (req, res) => {
  // Exploring how sessions work with a view count
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

  // We can refactor the code above using a higher order function.
  // find: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
  // const user = userDatabase.find(function(userObj) {
  //   return userObj.name === username && userObj.password === password;
  // })

  // Refactor to ES6
  const user = userDatabase.find((userObj) =>{
    return userObj.name === username && userObj.password === password;
  })

  if(user) { // if user is found, it means the username & password are correct
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
