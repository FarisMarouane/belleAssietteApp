var express=require("express");
var methodOverride = require('method-override');
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var passport=require("passport");
var localStrategy=require("passport-local");
var flash = require('connect-flash');
var path=require("path");
var Ingredient=require("./models/ingredient");
var User=require("./models/user");



// Start an express app
var app=express();

// To flash messages at users
app.use(flash());

// Session
app.use(require("express-session")({
	secret:"monSecret",
	resave:false,
	saveUninitialized:false

}));

// Authentification stuff
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Conncect to dataBase using mLab (mongodB)
// mongoose.connect("mongodb://localhost/kitchen_app");
mongoose.connect("mongodb://Marouane:samfar@ds145193.mlab.com:45193/kitchen_app");


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

// makes sure the following variables are defined on all routes
app.use(function(req, res, next){
   res.locals.currentUser=req.user;
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
   next();
});


// Requiring routes
var ingredientsRoute=require("./routes/ingredients/ingredients");
var loginRoute  =require("./routes/authentification/login");


// ============================
//        ROUTES
// ============================
app.use(ingredientsRoute);
app.use(loginRoute);



// Register form route
app.get("/register", function(req, res){
	res.render("register");
})

// Login form route
app.get("/login", function(req, res){	
	res.render("login");
})


// ===========================
//       Auth routes
// ===========================

// Register logic
app.post("/register", function(req, res){
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

app.post("/login", passport.authenticate("local", {
	successRedirect:"/inventory",
	failureRedirect:"/login",
	successFlash: "You have been successfully logged in"
}))

 
// Logout logic
app.get('/logout', function(req, res){
  req.logout();
  console.log("You successfully logged out");
  req.flash("success", "You have been successfully disconnected");
  res.redirect('/');
});

// IsLoggedIn middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash("error", "You must be logged in first");
		res.redirect("/login");
	}
}


var PORT=process.env.PORT || 8000;

app.listen(PORT, function(){
	console.log("Server is up and running on port 8000");
})