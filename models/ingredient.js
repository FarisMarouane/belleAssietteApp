
var mongoose=require("mongoose");

var IngredientSchema = new mongoose.Schema({
	name:String,
	number:Number,
	exist:Boolean,

	author:{
	id:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'User'
	}, 

	username:String
	},
	
	photoName:String
})

module.exports=mongoose.model("Ingredient", IngredientSchema);