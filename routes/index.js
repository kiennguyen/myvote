var express = require('express');
var passport = require('passport');
var Strategy = require('passport-bip').Strategy;
var app = require('../app');

/* GET home page. */
app.get('/', function(req, res) {
  res.render('index', { user: req.user });
});

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.get('/login/idp',
  passport.authenticate('openidconnect'));

app.get('/callback',
  passport.authenticate('openidconnect', { failureRedirect: '/login' }),
  function(req, res) {
    //res.redirect('/');
    res.render('profile', { user: req.user });
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

app.get('/logout',
  function(req, res){
    res.redirect('https://account.stage.bonnier.news/bip/logout?redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback%2Flogout&appId=exp-hk-www');
  });

app.get('/callback/logout',
  function(req, res) {
    req.session.destroy();
    res.redirect('/');
  });

app.get('/vote/create_vote_form',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('create_vote_form', { user: req.user });
  });

app.get('/vote/create',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('create_vote', { user: req.user });
  });

app.get('/vote/view',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('view_vote', { user: req.user });
  });

app.get('/vote/submit',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('create_vote', { user: req.user });
  });

app.get('/vote/statistics',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('statistics', { user: req.user });
  });

module.exports = router;
