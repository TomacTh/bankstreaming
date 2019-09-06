var express = require("express");
var router = express.Router();
var Movie = require("../models/movie");

var middleware = require("../middleware");


//=============================NEW========================================================
router.get("/new", middleware.isLoggedIn, function(req,res){
  res.render("movies/new");
  })

//==============CREATE=========================================================================


router.post("/", middleware.isLoggedIn, function(req,res){
  Movie.create(req.body.movie, function(err,newMovie){
    if(err){
        res.render("new");
    } else {
        console.log(req.body.movie)
        res.render("movies/show", {movie: newMovie})
    }
  })
});


//===================SHOW=========================================================================

router.get("/:id",middleware.isLoggedIn, function(req,res){
  Movie.findById(req.params.id, function(err, foundMovie){
    if(err){
      console.log(err)
    } else {
      console.log(foundMovie)
      res.render("movies/show", {movie: foundMovie})
    }
  })
})

//==============================================INDEX================================================
router.get("/",middleware.isLoggedIn, function(req,res){
  if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Movie.find({title: regex}, function(err, movies){
      if(err){
        console.log(err)
      } else {
          if(movies.length < 1) {
            req.flash("error", "Movie not found");
            return res.redirect("back");
          }
          res.render("movies/index", {movies: movies})
      } 
    });
  } else {
   Movie.find({}, function(err, movies){
      if(err){
        console.log(err)
      } else {
        res.render("movies/index", {movies: movies})
      } 
    });
  }
  
})

//===================EDIT======================================================================
router.get("/:id/edit",middleware.isLoggedIn,  function(req,res){
  Movie.findById(req.params.id, function(err, foundMovie){
    res.render("movies/edit", {movie: foundMovie });
  })
  
})

//=================UPDATE=========================================================================
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.isLoggedIn, function(req, res){
  
  
    Movie.findOneAndUpdate(req.params.id, req.body.movie, function(err, movie){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/movies/" + movie._id);
        }
    });
 
});

//============DELETE===============================================================================
router.delete("/:id",middleware.isLoggedIn,  function(req,res){
  Movie.findByIdAndRemove(req.params.id,function(err){
    if(err){
        res.redirect("/movies");
    } else {
        res.redirect("/movies")
    } 
  })
})




function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;