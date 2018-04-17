const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// Load routes

const ideas = require('./routes/ideas');

const users = require('./routes/users');

// PASSPORT CONF CALL

require('./config/passport')(passport);

// Map global promise - get rid of warning

mongoose.Promise = global.Promise;

// Connect to mongoose

// DB Config Load

const db = require('./config/database');

mongoose.connect(db.mongoURI)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));


// Handlebars middlewares

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body parser middlewares
app.use(bodyParser.urlencoded({ extended: false }))


// Static path
app.use(express.static(path.join(__dirname, 'public')));


// parse application/json
app.use(bodyParser.json())

// override with POST having ?_method=PUT
app.use(methodOverride('_method'))

// Sessions midlewares
app.use(session({
  secret: 'un4ck',
  resave: true,
  saveUninitialized: true
}));

// Passport midlewares
app.use(passport.initialize());
app.use(passport.session());

// flash midlewares

app.use(flash());

// Global vars

app.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null
  next();
});

// Index Route

app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route

app.get('/about', (req, res) => {
  res.render('about');
});


// User ideas route
app.use('/ideas',ideas);


// User route
app.use('/users',users);


// 404 or Error Catcher
app.use(function(req,res,next){
  res.redirect('/');
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);

});