const Comment = require('../models/comment')
const middlewareObj = {};



middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  req.flash("error",  "You need to be logged in to do that");
  res.redirect("/login");
}

middlewareObj.isAdmin = function(req,res,next){
  if(req.user.admin){
    return next()
  }
  req.flash("error",  "You need to be admin in to do that");
  res.redirect("/movies");
}


middlewareObj.checkCommentOwner = function(req, res, next) {
  if(req.isAuthenticated()){
         Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }  else {
                // does user own the comment?
             if(foundComment.author.id.equals(req.user._id)) {
                 next();
             } else {
                 req.flash("error", "You don't have permission to do that");
                 res.redirect("back");
             }
            }
         });
     } else {
         req.flash("error", "You need to be logged in to do that");
         res.redirect("back");
     }
 }

 module.exports = middlewareObj;