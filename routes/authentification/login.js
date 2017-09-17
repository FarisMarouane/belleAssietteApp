var express = require('express');
var router = express.Router();
var Ingredient = require('../../models/ingredient');
var User = require('../../models/user');
var passport = require('passport');
var localStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var flash = require('connect-flash');

// Register form route
router.get('/register', function (req, res) {
  res.render('register');
});

// Login form route
router.get('/login', function (req, res) {
  res.render('login');
});

// ===========================
//       Auth routes
// ===========================

// Register logic
router.post('/register', function (req, res) {
  if (req.body.password !== req.body.passwordBis) {
    console.log("The 2 passwords aren't the same");
    console.log(req.body.password);
    console.log(req.body.passwordBis);
    req.flash('success', "The 2 passwords aren't the same");
    res.redirect('/register');
  } else {
    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
      if (err) {
        console.log(err);
        req.flash('error', err);
        return res.redirect('/register');
      } else {
        console.log('new user added to db :');
        console.log(user);
        passport.authenticate('local')(req, res, function () {
          req.flash('success', 'You successfully signed up');
          res.redirect('/inventory');
        });
      }
    });
  }
});

// Login logic

router.post('/login', passport.authenticate('local', {
  successRedirect: '/inventory',
  failureRedirect: '/login',
  successFlash: 'You have been successfully logged in',
  failureFlash: true
}));

// Logout logic
router.get('/logout', function (req, res) {
  req.logout();
  console.log('You successfully logged out');
  req.flash('success', 'You have been successfully disconnected');
  res.redirect('/');
});

// IsLoggedIn middleware
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error', 'You must be logged in first');
    res.redirect('/login');
  }
}

module.exports = router;
