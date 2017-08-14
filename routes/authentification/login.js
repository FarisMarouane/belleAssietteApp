var express=require("express");
var router=express.Router();
var Ingredient=require("../../models/ingredient");
var User=require("../../models/user");
var passport=require("passport");
var localStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
var flash = require('connect-flash');


// Register form route
router.get("/register", function(req, res){
	res.render("register");
})

// Login form route
router.get("/login", function(req, res){	
	res.render("login");
})


// ===========================
//       Auth routes
// ===========================

// Register logic
router.post("/register", function(req, res){
	User.register(new User ({username:req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		} else if(req.body.password !== req.body.passwordBis){
			console.log("The 2 passwords aren't the same");
			console.log(req.body.password);
			console.log(req.body.passwordBis);
			console.log("success", "The 2 passwords aren't the same");			
		} else {
			console.log("new user added to db :");
			console.log(user);
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "You successfully signed up");
				res.redirect("/inventory");
			});
		}
	})
});

// Login logic

router.post("/login", passport.authenticate("local", {
	successRedirect:"/inventory",
	failureRedirect:"/login",
	successFlash: "You have been successfully logged in"
}))

 
// Logout logic
router.get('/logout', function(req, res){
  req.logout();
  console.log("You successfully logged out");
  req.flash("success", "You have been successfully disconnected");
  res.redirect('/');
});


module.exports=router;