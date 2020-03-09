var express = require("express");
var router = express.Router();
var Movie = require("../models/movie");

var middleware = require("../middleware");


//=============================NEW========================================================


router.get("/new", [middleware.isLoggedIn, middleware.isAdmin], function(req,res){
  
  res.render("movies/new");
  })

//==============CREATE=========================================================================


router.post("/", [middleware.isLoggedIn, middleware.isAdmin], async (req,res) =>{
  
  createAvoidError(req.body.movie.links);
  try {
      const movie = await Movie.create(req.body.movie)
      console.log(req.body.movie)
      res.render("movies/show", {movie})
  } catch(e) {
      req.flash("error", e.message);
      return res.render("movies/new");
  }
});


//===================SHOW=========================================================================

router.get("/:id", async (req,res) => {
  try {
      const movie = await Movie.findById(req.params.id).populate("comments");
      res.render("movies/show", {movie})
  } catch(e) {
      console.log(e)
      req.flash("error", "Movie not found");
      return res.redirect("/movies")
  }
})

//==============================================INDEX================================================
router.get("/",middleware.isLoggedIn, async (req,res) => {

  try {
      if (req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const movies = await  Movie.find({title: regex});
        if (movies.length<1){
          req.flash("error", "Movie not found");
          return res.redirect("back");
        }
        res.render("movies/index", {movies})
      }
      const movies = await Movie.find({})
      res.render('movies/index', {movies})

  } catch(e) {
      console.log(e)
      req.flash("error", e.message);
      res.redirect("back")
  }
 
})

//===================EDIT======================================================================
router.get("/:id/edit",[middleware.isLoggedIn, middleware.isAdmin], async  (req,res) => {
  try {
      const movie = await Movie.findById(req.params.id)
      res.render('movies/edit', {movie})
  } catch(e) {
      console.log(e)
      req.flash("error", e.message);
      res.redirect("back")
  }
})

//=================UPDATE=========================================================================
// UPDATE CAMPGROUND ROUTE
router.put("/:id", [middleware.isLoggedIn, middleware.isAdmin], async (req, res) => {

    req.body.movie.links[0] = updateAvoidBugLinks(req.body.movie.links[0]);
    req.body.movie.links[1] = updateAvoidBugLinks(req.body.movie.links[1]);
    
    try {
        console.log(req.params.id)
        const movie = await Movie.findById(req.params.id)
        await movie.update(req.body.movie)
        console.log(movie)
        req.flash("success","Successfully Updated!");
        res.redirect("/movies/" + movie._id);
    } catch(e) {
      console.log(e)
      req.flash("error", e.message);
      res.redirect("back");
    }
 
});

//============DELETE===============================================================================
router.delete("/:id",  [middleware.isLoggedIn, middleware.isAdmin],  async (req,res) => {
  try {
      const movie = await  Movie.findByIdAndRemove(req.params.id);
      req.flash("success","Successfully Removed!");
      res.redirect("/movies")
  } catch(e) {
      res.redirect("/movies");
  }
})


const links = (arr) => {
  //Remove empty links and double
    return arr.filter((el,i) => {
      return  el !== "" && arr.indexOf(el) === i 
    }) 
}  


const updateAvoidBugLinks  = (arr) => {
  if(typeof(arr) == 'string'){
    arr = arr;
    return arr
  } else {
    arr = links(arr)
    return arr
  }
}

const createAvoidError =(arr,i = 0,y = 1) => {
  if(arr !== undefined && arr[i]){
    arr[i] = updateAvoidBugLinks(arr[i]);
    return arr[i]
  } 
  else if(arr !== undefined && arr[y]){
    arr[y] = updateAvoidBugLinks(arr[y]);
    return arr[y]
  }
  
}

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;