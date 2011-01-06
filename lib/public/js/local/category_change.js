function update_subcategories(selectedCategory, row) {
    $(row).find("select.subcategory").html("");
    $(row).find("select.subcategory").append(
        $('<option></option>').html(""));
    loadSubcategory(selectedCategory,row);
}

function loadSubcategory(selectedCategory,row){

    
    $.post("/category/get_subcategories", {
        category:selectedCategory
    }, function(data){
        var selected_subcategory = $("input.temp_selected_subcategory").val();
//        alert(selected_subcategory);

        for(i=0;i<data.length;i++){
            if(data[i] == selected_subcategory){
                $(row).find('select.subcategory').append(
                    $('<option selected=""></option>').html(data[i]));
            }
            else{
                $(row).find('select.subcategory').append(
                    $('<option></option>').html(data[i]));
            }
        }
    }, "json");
}