var mongoose = require("mongoose");





var movieSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  links: Array,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});



module.exports = mongoose.model("Movie", movieSchema);