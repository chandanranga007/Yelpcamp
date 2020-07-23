
     var express = require("express");
     var router = express.Router({mergeParams : true});
     var Campground = require("../models/campground");
     var middleware = require("../middleware");




        // INDEX : Show all campgrounds
    router.get("/",function(req,res){
     // console.log(req.user);
    	// GEt data from DB
    	Campground.find({},function(err,allCampgrounds){
    		if(err){
    			console.log(err);
    		}
    		else{
    			res.render("campgrounds/Index",{campgrounds:allCampgrounds});
    		}
    	});
    	
    });
        
        // CREATE : Add newcampgrounds to DB
    router.post("/",middleware.isLoggedIn,function(req,res){
         //get data from the form and add to campgrounds array
         var name = req.body.name;
         var price = req.body.price;
         var image = req.body.image;
         var desc = req.body.description;
         var author = {
            id : req.user._id,
            username : req.user.username
         }
         var newcampground = {name: name,price: price,image:image,description:desc,author:author}
        
         // Create a new campground and save to data base
          Campground.create(newcampground,function(err,newlycreated){
                    if(err){
                    	console.log(err);
                    }
                    else{
                    	   //redirect back to campground page
                           console.log(newlycreated);
                    	res.redirect("/campgrounds");
                    }
          });
      
         
    });
       // NEW : Show form to create new campground 
    router.get("/new",middleware.isLoggedIn,function(req,res){
        	res.render("campgrounds/new");
    });
       
       //  Show : more info about one campground
        router.get("/:id",function(req,res){
        	// Show the campground with provided ID
        	 Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
                         if(err){
                         	console.log(err);
                         }
                         else{
                         	// render show template with campground
        	                 res.render("campgrounds/show",{campground : foundCampground});
                         }
        	 });
        	
    });

         // Edit Campground Route
         router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
            
              Campground.findById(req.params.id,function(err,foundCampground){
                     res.render("campgrounds/edit",{campground:foundCampground});
                });         
                 
         });  

          // Update Campground route
          
          router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
            // find and update the correct campground
            Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
                if(err){
                    res.redirect("/campgrounds");
                }
                else{
                     res.redirect("/campgrounds/" + req.params.id);
                }
            })
          })
      
       // Destroy Campground
       router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){

       // res.send("you wanna delete something");
          Campground.findByIdAndRemove(req.params.id,function(err){
            if(err){
                res.redirect("/campgrounds");
            }
            else{
                res.redirect("/campgrounds");
            }
          });
       });
       
      

     
      

        module.exports=router;