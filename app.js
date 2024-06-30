const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const fileRoutes = require('./routes/fileRoutes');
const upload = require("./routes/upload");
require('dotenv').config();

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = process.env.MONGO_URI;

app.use('/upload', upload);

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layout'); // This sets the default layout file

// Bodyparser
app.use(bodyParser.urlencoded({ extended: false }));

// Express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use(express.static('uploads'));
app.use(express.static('public'));


// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/files', fileRoutes);
app.use('/', require('./routes/dashboard')); // Register the dashboard route

// Render upload form
app.get('/upload', (req, res) => {
  res.render('upload', { title: 'Upload File' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
