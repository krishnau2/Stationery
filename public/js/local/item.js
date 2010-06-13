var newId=1;
var row;

$(document).ready(function(){
    newRow();    
    $("select.category").change(function(){
        row=$(this).parent().parent();
        var selectedCategory=$(row).find("select.category :selected").text();
        var page="getSubcategory";
        $(row).find("select.subcategory").html("");
        $(row).find("select.subcategory").append(
            $('<option></option>').html(""));
        loadSubcategory(page,selectedCategory,row);
    });

});

function loadSubcategory(page,selectedCategory,row){
    $.post("Item/ajax", {
        from:page,
        selectedCategory:selectedCategory
    }, function(data){
        for(i=0;i<data.length;i++){
            $(row).find('select.subcategory').append(
                $('<option></option>').html(data[i]));
        }
    }, "json");
}

function newRow(){
    $('#sl').attr("disabled", true);
    $('#sl').val(newId);
    //     Clone and append the template.
    $('#item_details').append($('#new_item_details_template').clone(true).attr('id','row'+newId));
    $("#row"+newId).show();
    $("#category").focus();
    // Remove all Blurs from every existing amount. We need blur only for the last row we appended.
    $("input.reorderLevel").unbind('blur');
    // Giving name attribute to every elaments of row
    $("#row"+newId).find("#sl").attr('name', 'sl');
    $("#row"+newId).find("#category").attr('name', 'row'+newId+'_category');
    $("#row"+newId).find("#subcategory").attr('name', 'row'+newId+'_subcategory');
    $("#row"+newId).find("#itemName").attr('name', 'row'+newId+'_itemName');
    $("#row"+newId).find("#reorderLevel").attr('name', 'row'+newId+'_reorderLevel');
    // Creating new row when "amount" field of the current row is get out of focus.
    $("#row"+newId).find("#reorderLevel").blur( function() {
        newRow()
    });
    newId=newId+1;
}