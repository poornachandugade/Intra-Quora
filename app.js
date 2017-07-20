'use strict';

var express = require("express");
var app = express();
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var mongoose = require('mongoose');

//importing route.js file
//var route = require('./route.js');

var bodyParser = require('body-parser');
var cookieParser  = require('cookie-parser');

var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));// for parsing application/x-www-form-urlencoded
app.use(cookieParser());

var session = require('express-session');
app.use(session({
  secret:'keyboard cat',
  resave:false,
  saveUninitialized:true,
  cookie:{secure:true}
}));

var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine','jade');
app.set('views',__dirname+'/views');
app.use('/',express.static(__dirname + '/public'));



// serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: "173357299093-57442tp3lbem6ngl0q89fthr0mks5r8m.apps.googleusercontent.com",
    clientSecret: "aiAGHKdIZ9lli5bxAsTSi9-W",
    callbackURL: "http://localhost:3000/auth/google/callback"
},
function(identifier, profile, done) {
  process.nextTick(function () {
   profile.identifier = identifier;
    return done(null, profile);
  });
 }
));

app.get('/auth/google',
    passport.authenticate('google', {
       scope: 'email',
    }));
app.get('/auth/google/callback',
passport.authenticate('google', { failureRedirect: '/signin' }),
  function(req, res) {
    res.redirect('/timeline');
  });

  // test authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/timeline');
}




//routes
app.get('/',function(req,res){
    res.render('signin');
    });
app.get('/timeline',function(req,res){
   res.render('timeline',{userInfo:userInfo});
});
app.get('/profile',function(req,res){
  res.render('profile',{userInfo:userInfo});
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
app.post('/timeline/post',function(req,res){
      console.log(req.body);
      res.send('posted successfully');
      var post = new Post({
        title:req.body.title,
        description:req.body.description,
        createdOn:Date.now()

      });

post.save(function(err) {
  if (err) throw err;

  console.log('post created!');
  //console.log(personInfo.name);

});
});

//variables holding data
var userInfo = "userdata";




// connect to the database
mongoose.connect('mongodb://localhost/googleProfiles');

// create a user model
var User = mongoose.model('User', {
  oauthID: Number,
  name:String,
  email:String,
  photo:String,
  created:Date
});

// serialize and deserialize
passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user._id)
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user){
    console.log(user)
    if(!err) done(null, user);
    else done(err, null)
  })
});

// config
passport.use(new GoogleStrategy({
   clientID: "173357299093-57442tp3lbem6ngl0q89fthr0mks5r8m.apps.googleusercontent.com",
    clientSecret: "aiAGHKdIZ9lli5bxAsTSi9-W",
    callbackURL: "http://localhost:3000/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
userInfo = profile;
User.findOne({ oauthID: profile.id }, function(err, user) {
 if(err) { console.log(err); }
 if (!err && user != null) {
   done(null, user);
 } else {
   var user = new User({
     oauthID: profile.id,
     name:profile.displayName,
     email:profile.emails[0].value,
     photo:profile.photos[0].value,
     created: Date.now()
   });
   user.save(function(err) {
     if(err) {
       console.log(err);
     } else {
       console.log("saving user ...");
       done(null, user);
     };
   });
 };
});
}
));

//post schema and model
var postSchema  = mongoose.Schema({
  title:String,
  description:String,
  createdOn:Date
});
var Post = mongoose.model('Post',postSchema);


//server port
app.listen(3000,function(){
    console.log('Server running on port 3000!');
});