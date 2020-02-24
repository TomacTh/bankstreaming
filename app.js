const express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Movie = require("./models/movie"),
    methodOverride = require("method-override"),
    ejsLint = require('ejs-lint');


//===========REQUIRE ROUTES================================
const indexRoutes = require("./routes/index");
const moviesRoutes = require("./routes/movies");
const commentRoutes = require("./routes/comment")
   
    


mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser: true,  useCreateIndex: true, useFindAndModify: false} )
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
app.use("/movies/:id/comments", commentRoutes);



//)========================================================================================
var port =  process.env.PORT;
app.listen(port, function(){
  console.log("SERVER HAS STARTED");
})