// all middleware goes here
 var Campground = require("../models/campground");
 var Comment = require("../models/comment");

var middlewareObj = {};
   

   middlewareObj.checkCampgroundOwnership = function(req,res,next){

                  if(req.isAuthenticated()){
                
                      Campground.findById(req.params.id,function(err,foundCampground){
                if(err){
                	req.flash("Campground not found");
                    res.redirect("/campgrounds");
                }
                else{

                      // does user own the campground
                      if(foundCampground.author.id.equals(req.user._id)){
                           next();
                      }
                      else{
                            res.redirect("back");
                      }                                        
                    }   
                 }); 
               }else{
               	      req.flash("error","You don't have Permission");
                      res.redirect("back");
               }     
           }

     middlewareObj.checkCommentOwnership = function(req,res,next){

                  if(req.isAuthenticated()){
                
                      Comment.findById(req.params.comment_id,function(err,foundComment){
                if(err){
                
                    res.redirect("/campgrounds");
                }
                else{

                      // does user own the comment?
                      if(foundComment.author.id.equals(req.user._id)){
                           next();
                      }
                      else{
                            res.redirect("back");
                      }                                        
                    }   
                 }); 
               }else{ 
               	      req.flash("error","You don't have Permission");
                      res.redirect("back");
               }       
           }
       

       middlewareObj.isLoggedIn = function(req,res,next){

          if(req.isAuthenticated()){
            return next();
        }
        req.flash("error","Please Login First");
         res.redirect("/login");
      }
         
       



module.exports=middlewareObj;