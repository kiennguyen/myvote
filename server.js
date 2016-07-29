var express = require('express');
var passport = require('passport');
var Strategy = require('passport-bip').Strategy;


// Configure the Twitter strategy for use by Passport.
//
// OAuth 1.0-based strategies require a `verify` function which receives the
// credentials (`token` and `tokenSecret`) for accessing the Twitter API on the
// user's behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    authorizationURL: 'https://account.stage.bonnier.news/bip/authorize',
    tokenURL: 'http://api.qa.newsplus.se/v1/oauth2/token',
    userInfoURL: 'http://api.qa.newsplus.se/v1/oauth2/userinfo',
    scope: 'email profile appId:exp-hk-www',
    scopeSeparator: ' ',
    callbackURL: 'http://localhost:3000/callback'
  },
  function(token, tokenSecret, profile, cb) {
    // In this example, the user's Twitter profile is supplied as the user
    // record.  In a production-quality application, the Twitter profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Twitter profile is serialized
// and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// Define routes.
app.get('/',
  function(req, res) {
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
    res.redirect('/');
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

app.get('/vote/create',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      res.render('create-vote', { user: req.user });
    });

app.listen(3000);
