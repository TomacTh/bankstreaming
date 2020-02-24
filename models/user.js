const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");




var UserSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    
  },
  admin: Boolean,
  email:{
    type: String,
    required: true
  }
  
});

UserSchema.plugin(passportLocalMongoose,  {usernameQueryFields: ["email"]});


module.exports = mongoose.model("User", UserSchema);