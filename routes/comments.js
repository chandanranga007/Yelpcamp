     var express = require("express");
     var router = express.Router({mergeParams : true});
     var Campground = require("../models/campground");
     var Comment = require("../models/comment");
     var middleware = require("../middleware");




      //========================================
       //  Comments Routes
      //=========================================
      
      router.get("/new",middleware.isLoggedIn,function(req,res){
        // Find campground by ID
        console.log(req.params.id);
        Campground.findById(req.params.id,function(err,campground){
          if(err){
            console.log(err);
          }
          else{
                res.render("comments/new",{campground:campground});
          }
        });
        
      });

      router.post("/",middleware.isLoggedIn,function(req,res){
         // lookupcampground using Id
          Campground.findById(req.params.id,function(err,campground){
            if(err){
              console.log(err);
              res.redirect("/campgrounds");
            }
            else{
                 Comment.create(req.body.comment,function(err,comment){
                      if(err){
                        console.log(err);
                      }
                      else{
                      // Add username and id to comment
                      comment.author.id = req.user._id;
                      comment.author.username = req.user.username;
                      console.log("New comment's username will be :" + req.user.username);
                      // Save comment
                      comment.save();
                        campground.comments.push(comment);
                         campground.save();
                         console.log(comment);
                          res.redirect("/campgrounds/"+campground._id);
                      }

                 });
               
            }
          });

      });
         // Comments edit Route
         router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
            Comment.findById(req.params.comment_id,function(err,foundComment){
              if(err){
              res.redirect("back");
            }
            else{
                  req.flash("success", " Comment added");
                  res.render("comments/edit",{campground_id : req.params.id, comment : foundComment});
            }
            });
               
         });

         // Comments Update
         router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
              Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
                    
                    if(err){
                      res.redirect("back");
                    }
                    else{ 
                          req.flash("success", " Comment updated");
                          res.redirect("/campgrounds/" + req.params.id);
                    }
              });
         });

         // Comment destroy route

         router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
             // find by id and remove
               Comment.findByIdAndRemove(req.params.comment_id,function(err){
                if(err){
                  res.redirect("back");
                }
                else{
                        req.flash("success", " Comment deleted");
                      res.redirect("/campgrounds/" + req.params.id);
                }
               }); 
         });
            
          
         

      module.exports = router;