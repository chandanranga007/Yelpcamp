
     var express = require("express");
     var router = express.Router();
     var passport = require("passport");
     var User = require("../models/user");







    router.get("/",function(req,res){
        res.render("landing");
    });


   

      //=============================
      // Auth Route
      //=============================

      router.get("/register",function(req,res){
          res.render("register");
      });

      // Handle Sign up logic
      router.post("/register",function(req,res){
         var newUser =  new User({username:req.body.username});
         User.register(newUser,req.body.password,function(err,user){
          if(err){
            console.log(err);
            req.flash("error",err.message);
            return res.render("register");
          }
            passport.authenticate("local")(req,res,function(){
              req.flash("success", " Welcome to YelpCamp" + user.username);
              res.redirect("/campgrounds");
            });

         });
      });

      // Show login Form
      router.get("/login",function(req,res){
            res.render("login");
      });
      // Handling Login Logic
      router.post("/login",passport.authenticate("local",{successRedirect:"/campgrounds",failureRedirect:"/login"}),function(req,res){

      });

      // Log Out Logic

      router.get("/logout",function(req,res){
             req.logout();
             req.flash("success","Logged You Out");
             res.redirect("/campgrounds");
      });
      
      // Middleware
   function isLoggedIn(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
         res.redirect("/login");
      }
   
      module.exports = router;