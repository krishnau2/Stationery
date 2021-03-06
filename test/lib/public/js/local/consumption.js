var newId=1;
var row;

$(document).ready(function(){
    $('#consumeDate').datepicker({
        dateFormat: 'yy-mm-dd'
    });
    //    Create the first row.
    createRow();

    $("select.category").change(function(){
        row=$(this).parent().parent();
        var selectedCategory=$(row).find("select.category :selected").text();
        update_subcategories(selectedCategory, row)
    });

    $("select.subcategory").change(function(){
        row=$(this).parent().parent();
        var selectedCategory=$(row).find("select.category :selected").text();
        var selectedSubcategory=$(row).find("select.subcategory :selected").text();
        var page="getItem";
        $(row).find("select.itemName").html("");
        $(row).find("select.itemName").append(
            $('<option></option>').html(""));
        loadItems(selectedCategory,selectedSubcategory,row);
    });

});
function loadItems(selectedCategory, selectedSubcategory,row){
    $.post("/items/get_description", {
        category: selectedCategory,
        subcategory:selectedSubcategory
    }, function(data){
        for(i=0;i<data.length;i++){
            $(row).find('select.itemName').append(
                $('<option></option>').html(data[i]));
        }
    }, "json");
}

function createRow(){
    $('input.sl').attr("readonly", "true");
    $('#sl').val(newId);
    //     Clone and append the template.
    $('#consumption_details').append($('#consumption_template').clone(true).attr('id','row'+newId));
    if((newId % 2)==0){
        $("#row"+newId).css("background-color", "white");
    }
    else{
        $("#row"+newId).css("background-color", "#EBEBEB");
    }
    var newRow = $("#row"+newId);
    newRow.show();
    // Remove all Blurs from every existing amount. We need blur only for the last row we appended.
    $("input.quantity").unbind('blur');
    // Giving name attribute to every elaments of row
    newRow.find("#sl").attr('name', 'sl');
    newRow.find("#itemName").attr('name', 'row'+newId+'_itemName');
    newRow.find("#quantity").attr('name', 'row'+newId+'_quantity');
    // Creating new row when "quantity" field of the current row is get out of focus.
    newRow.find("#quantity").blur( function() {
        nextRow=createRow();
        nextRow.find("#category").focus();
    });
    newId=newId+1;
    return newRow
}