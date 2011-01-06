$(document).ready(function() {

    var selectedCategory=$("select.category :selected").text();

    if(selectedCategory != "" ){
        update_subcategories(selectedCategory, $(document));
    }

    $("select.category").change(function() {
        update_subcategories($("select.category :selected").text(), $(document));
    });
    $("input.numeric").numeric();
});