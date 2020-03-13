const express = require("express");
const router = express.Router();
const passport = require("passport")
const User = require("../models/user")
const {sendContactEmail, sendRegisterEmail} = require("../email/email")



//=========ROOT PAGE===================================

router.get("/", function(req,res){
  res.render("home");
})


//================SIGN UPFORM================================

router.get("/register", function(req,res){
  res.render("register",{page: 'register'});
})

//=====================POST THE FORM, CREATE A NEW USER, LOGIN==========================================
router.post("/register", function(req,res){
  var newUser = new User({username: req.body.username, email: req.body.email});
  User.register(newUser,req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register", {error: err.message});
    } 
    sendRegisterEmail(req.body.username, req.body.email);
    passport.authenticate("local")(req,res, function(){
      req.flash("success", "Welcome to Bankstreaming "+ user.username);
      res.redirect("/");
    });
  });
});
//===================LOGIN FORM===============
router.get("/login",function(req,res){
  res.render("login", {page: 'login'});
})

//================LOGIN POST====================


router.post("/login",passport.authenticate("local", 
  {
  successRedirect: '/movies', 
  failureRedirect: '/login',
  failureFlash: true,
  successFlash: true
  })
);

//===================LOGOUT===
router.get("/logout",(req,res) => {
  req.logout();
  req.flash("error", "Logged you out!")
  res.redirect("/")
})

//=================CONTACT=============
router.get("/contact", (req,res) => {
  res.render("contact")
})

//========CONTACT POST==================

router.post("/contact", (req,res) => {
  sendContactEmail(req.body.message);
  req.flash("success", "Mail sent")
  res.redirect("/")
})

module.exports = router;