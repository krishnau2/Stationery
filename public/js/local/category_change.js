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
        for(i=0;i<data.length;i++){
            $(row).find('select.subcategory').append(
                $('<option></option>').html(data[i]));
        }
    }, "json");
}