var express = require("express");
var router = express.Router({mergeParams:true});
var Movie = require("../models/movie");
var Comment = require("../models/comment");

var middleware = require("../middleware");


//==============CREATE=======================================
router.post("/",middleware.isLoggedIn, async  (req,res) => {
  //fincampgroudusingID
  try {
    
    const movie = await Movie.findById(req.params.id)
    if (!movie){
      throw new Error()

    }
    const comment = await Comment.create(req.body.comment)
    if(!comment){
      throw new Error()
    }
    console.log(comment.createdAt)
    
    comment.author.id = req.user._id;
    comment.author.username = req.user.username;
    //savecomment
    comment.save();
    movie.comments.push(comment);
    movie.save();
    req.flash("success", "Successfully added comment")
    res.redirect("/movies/"+movie._id)
  
  
  } catch(e) {
      console.log(e)
      req.flash("error", e.message);
      res.redirect("back")
  }
  
})

//=============UPDATE===========================================================//

router.put('/:comment_id',[middleware.isLoggedIn, middleware.checkCommentOwner], async (req,res) => {
  try {
      const movie = await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment)
      if(!movie){
        req.flash("error", e.message)
        res.redirect("back")
      }
      req.flash("success", "Comment updated");
      res.redirect("/movies/"+ req.params.id)
  } catch(e) {
      req.flash("error", e.message)
      res.redirect("back")
  }
})

//=============DELETE===========================================================//

router.delete('/:comment_id',[middleware.isLoggedIn, middleware.checkCommentOwner], async (req,res) => {
  try {
      await Comment.findByIdAndRemove(req.params.comment_id)
      req.flash("success", "Comment deleted");
      res.redirect("/movies/"+ req.params.id)
  } catch(e) {
      req.flash("error", e.message)
      res.redirect("back")
  }
})

module.exports = router;
