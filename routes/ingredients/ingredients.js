var express=require("express");
var router=express.Router();
var bodyParser=require("body-parser");
var Ingredient=require("../../models/ingredient");

// Home page route
router.get("/", function(req, res){
	res.render("home");
})

// Index route
router.get("/inventory", function(req, res){
	Ingredient.find({}, function(err, allIngredients){
		if(err){
			console.log(err);
		} else {
			res.render("inventory", {ingredients:allIngredients});		
		}
	})
})


// Add new ingredient form route
router.get("/inventory/new", isLoggedIn, function(req, res){
	res.render("new");
})

// Add new ingredient post route
router.post("/inventory", function(req, res){

					var author={
				        id:req.user._id,
				        username: req.user.username
    				};

					var ingredientNew={
					name:req.body.name,
					number:req.body.number,	
					exist:req.body.checkbox,				
					author:author,				    
				    photoName:req.body.photo
				    };

					Ingredient.create(ingredientNew, function(err, newIngredient){
							if(err){
								console.log(err);
							} else {
								console.log("new ingredient added to db");					 			
					 			console.log(newIngredient.exist);
					 			req.flash("success", "You successfully added a new Ingredient");
								res.redirect("/inventory");
							       }
				             })					  
				     	});


// Show route
router.get("/inventory/:id", isLoggedIn,  function(req, res){
	Ingredient.findById(req.params.id, function(err, foundIngredient){
		if(err){
			console.log(err);				
		} else {
			res.render("show",{ingredient:foundIngredient});
		}
	})
})


// Edit form route
router.get("/inventory/:id/edit", isLoggedIn,function(req, res){

			Ingredient.findById(req.params.id, function(err, foundIngredient){
				if(err){
					console.log(err);
				} else {
					// render edit form
					res.render("update", {ingredient:foundIngredient});	
				}
	     })	
});


// update route
router.put("/inventory/:id", isLoggedIn, function(req, res){

		var ingredientUpdated={
			photoName:req.body.item["photoName"],
			name:req.body.item["name"],
			number:req.body.item["number"],
			exist:req.body.item["checkbox"]			
		}

	   Ingredient.findByIdAndUpdate(req.params.id, ingredientUpdated, {new: true}, function(err, updatedIngredient){
		if(err){
			console.log(err);
		} else {	
		console.log(req.headers.referer);		
			if(req.xhr){
				res.json(updatedIngredient);
			} else {
				req.flash("success", "You successfully updated the Ingredient's info");
				res.redirect("/inventory/" + req.params.id);	
			}			
		}
	})
})

// Delete route
router.delete("/inventory/:id", isLoggedIn, function(req, res){
	Ingredient.findByIdAndRemove(req.params.id, function(err, deletedIngredient){
		if(err){
			console.log(err);
		} else {
			console.log(req.body.item);
			if(req.xhr){
				res.json(deletedIngredient);
			} else {
				res.redirect("/inventory");	
			}
			
		}
	})
})

// IsLoggedIn middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash("error", "You must be logged in first");
		res.redirect("/login");
	}
}


module.exports=router;