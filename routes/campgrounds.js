var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Contact = require('../models/contact');
var middleware = require('../middleware');

/*router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds});
       }
    });
});
*/
const escapeRegex = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
router.get("/", (req, res) => {

  let noMatch = null;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');

    Campground.find({name: regex}, function(err, allCampgrounds) {
      if (err) { console.log(err); }
      else {
        if (allCampgrounds.length < 1) {
          noMatch = "No campgrounds found, please try again.";
        }
        res.render("campgrounds/index", { campgrounds: allCampgrounds, page: "campgrounds", noMatch: noMatch });  
      }
    });
  } else {
    // Get all camgrounds from DB
    
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds});
       }
    });
  }
});


//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var image1 = req.body.image1;
    var image2 = req.body.image2;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image,image1: image1,image2: image2, description: desc, author: author ,price: price}

    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated)
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

//CONTACT
router.get("/contact", function(req, res){
    res.render('campgrounds/contact');
});

router.post('/contact', function(req, res){
    var details = req.body.details;
    Contact.create(details, function(err, contact){
        if(err){
            console.log(err)
        }else{
            res.render('campgrounds/contact-success', {contact: contact})
        }
    })
})

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})

//EDIT
router.get('/:id/edit',middleware.checkOwner, function(req, res){
        Campground.findById(req.params.id, function(err, campground){
                    res.render('campgrounds/edit',{campground: campground});
            })
        }) 

router.put('/:id',middleware.checkOwner, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
        if(err){
            res.redirect('/campgrounds')
        }else{
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
})

//DELETE ROUTE
router.delete('/:id',middleware.checkOwner, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/campgrounds')
        }else{
            res.redirect('/campgrounds')
        }
    });
});

module.exports = router;
