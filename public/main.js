$(function (){

  $(".plus-button").on("mouseenter", function(){
	$(this).attr("class", "fa fa-plus-circle fa-4x");
});

  $(".plus-button").on("mouseleave", function(){
	$(this).attr("class", "fa fa-plus-circle fa-2x");
});

  $(".minus-button").on("mouseenter", function(){
	$(this).attr("class", "fa fa-minus-circle fa-4x");
});

  $(".minus-button").on("mouseleave", function(){
	$(this).attr("class", "fa fa-minus-circle fa-2x");
});



// Edit plus quantities
$(".plus-button").on("click", function(){

    var handler = $(this).siblings(".editIngredientForm");
    var oldNumber = handler.find('input[name="item[number]"]').val();
    var newNumber = Number(oldNumber) + 1;
    var numberOfIngredient = $(this).parent("#changeQuantitiesButtons").siblings("#state-of-inventory").children("#number-of-ingredient");

    handler.find('input[name="item[number]"]').val(newNumber);
   
    var formData= handler.serialize();
	var actionUrl = $(this).siblings(".editIngredientForm").attr("action");   

    $.ajax({
        url:actionUrl,        
        data:formData,
        type:"PUT",              
        success: function(data){
           numberOfIngredient.html(newNumber);
        }
    })
});

// Edit minus quantities
$(".minus-button").on("click", function(){

    var handler = $(this).siblings(".editIngredientForm");
    var oldNumber = handler.find('input[name="item[number]"]').val();
    var newNumber = Number(oldNumber) - 1;
    var numberOfIngredient = $(this).parent("#changeQuantitiesButtons").siblings("#state-of-inventory").children("#number-of-ingredient");
    handler.find('input[name="item[number]"]').val(newNumber);
   
    var formData= handler.serialize();
	var actionUrl = $(this).siblings(".editIngredientForm").attr("action");   

    $.ajax({
        url:actionUrl,        
        data:formData,
        type:"PUT",              
        success: function(data){
           numberOfIngredient.html(newNumber);
        }
    })
});


// Delete an ingredient ajax request
$(".fa-times").on("click", function(){
	var confirmResponse = confirm("Are you sure you want to remove this ingredient");	
	var actionUrl = $(this).siblings(".deleteIngredientForm").attr("action");
	var $itemToDelete = $(this).closest(".thumbnail");

	if(confirmResponse){
		$.ajax({
	  	url:actionUrl,
	  	type:"DELETE",
	  	itemToDelete: $itemToDelete,
	  	success:function(data){
	  		console.log(data);
	  		this.itemToDelete.remove();
	  	}
	  })
	}	
})


$(".container-show").on("submit", ".show-delete-form", function(e){
	e.preventDefault();
	var confirmResponse = confirm("Are you sure you want to delete this ingredient ?");

	if(confirmResponse){
		var actionUrl=$(this).attr("action");
		var $itemToDelete=$(this).closest(".thumbnail");

		$.ajax({
			url:actionUrl,
			type:'DELETE',
			itemToDelete:$itemToDelete,
			success: function(data){
				console.log(data);
				this.itemToDelete.remove();
			}
		})
	}
})
});