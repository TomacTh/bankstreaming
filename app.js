var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Movie = require("./models/movie"),
    methodOverride = require("method-override");


//===========REQUIRE ROUTES================================
var indexRoutes = require("./routes/index");
var moviesRoutes = require("./routes/movies");
   
    


mongoose.connect("mongodb://localhost/thomas",{ useNewUrlParser: true } )
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname+ "/public"));
app.use(methodOverride("_method"));
app.use(flash());


//=============================PASSPORTCONFIGURATION==================================================

app.use(require("express-session")({
  secret: "once again tom is the best",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize()); 
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//====================================================
//=======================================================================================================
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
})


app.use("/", indexRoutes);
app.use("/movies",moviesRoutes);



//)========================================================================================
var port = 3000;
app.listen(port, function(){
  console.log("SERVER HAS STARTED");
})