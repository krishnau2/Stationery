var newId=1;
var row;

$(document).ready(function(){
    $('#consumeDate').datepicker({
        dateFormat: 'yy-mm-dd'
    });

    $('#start_date').datepicker({
        dateFormat: 'yy-mm-dd'
    });

    $('#end_date').datepicker({
        dateFormat: 'yy-mm-dd'
    });

    $("#quantity").numeric();
    $("#available_stock").hide();
    //    Create the first row.
    createRow();

    $("select.category").click(function(){
        $("#available_stock").fadeOut(1000)
    })

    $("select.category").change(function(){
        row=$(this).parent().parent();
        var selectedCategory=$(row).find("select.category :selected").text();
        update_subcategories(selectedCategory, row)
    });

    $("select.subcategory").change(function(){
        row=$(this).parent().parent();
        var selectedCategory=$(row).find("select.category :selected").text();
        var selectedSubcategory=$(row).find("select.subcategory :selected").text();
        //        var page="getItem";
        $(row).find("select.itemName").html("");
        $(row).find("select.itemName").append(
            $('<option></option>').html(""));
        loadItems(selectedCategory,selectedSubcategory,row);
    });
    $("select.itemName").change(function(){
        row=$(this).parent().parent();
        var selectedCategory=$(row).find("select.category :selected").text();
        var selectedSubcategory=$(row).find("select.subcategory :selected").text();
        var selectedItemName=$(row).find("select.itemName :selected").text();
        //calculating the available balance for the selected item
        find_available_stock(selectedCategory,selectedSubcategory,selectedItemName);
        $("#available_stock").fadeIn(1000);
    });

    // On submition validating the entry fields.
    $('#saveConsumption').click(function(e){
        static_entry_field_validation(e);
        recurring_entry_field_validation(e);
    });

});



function find_available_stock(selectedCategory,selectedSubcategory,selectedItemName){
    $.post("/consumption/get_available_stock", {
        category: selectedCategory,
        subcategory: selectedSubcategory,
        itemName: selectedItemName
    }, function(data){
        $("#available_stock").html("Available Stock is "+data+" nos.");
    },"json");

}

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
    newRow.find("#category").attr('name', 'row'+newId+'_category');
    newRow.find("#subcategory").attr('name', 'row'+newId+'_subcategory');
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

function static_entry_field_validation(e){
    if($('#consumeDate').val() == ""){
        e.preventDefault();
        alert("Please enter Consume Date.");
    }
    else if($('#forUnit').val() == "" ){
        e.preventDefault();
        alert("Please select a Unit.");
    }
    else if ($('#user').val() == ""){
        e.preventDefault();
        alert("Please enter a User.");
    }
}

function recurring_entry_field_validation(e){
    var i=1;
    var selectedCategory;
    var selectedSubategory;
    var itemName;
    var input_quantity;
    // if new row is not have been created then "newId" will be 1.
    if(newId == 2){
        row="#row"+i;

        selectedCategory = $(row).find("select.category :selected").text();
        selectedSubategory = $(row).find("select.subcategory :selected").text();
        itemName = $(row).find("select.itemName :selected").text();
        input_quantity = $(row).find("input.quantity").val();

        if(selectedCategory == "" || selectedSubategory == "" || itemName == ""){
            e.preventDefault();
            alert("Please select an Item at line "+i);
        }
        else{
            if(input_quantity == ""){
                e.preventDefault();
                alert("Quantity should not be BLANK at line "+i);
            }
            else if(input_quantity == 0){
                e.preventDefault();
                alert("Quantity should not be ZERO at line "+i);
            }
        }
    }
    // if new row is created then "newId" will be increased by one.
    else{
        for(i=1;i < (newId);i++){
            row="#row"+i;

            selectedCategory = $(row).find("select.category :selected").text();
            selectedSubategory = $(row).find("select.subcategory :selected").text();
            itemName = $(row).find("select.itemName :selected").text();
            input_quantity = $(row).find("input.quantity").val();

            if(selectedCategory == ""){
                continue;
            }
            else if(selectedCategory != "" && selectedSubategory == "" || itemName == ""){
                e.preventDefault();
                alert("Please select an Item at line "+i);
            }
            else{
                if(input_quantity == ""){
                    e.preventDefault();
                    alert("Quantity should not be BLANK at line "+i);
                }
                else if(input_quantity == 0){
                    e.preventDefault();
                    alert("Quantity should not be ZERO at line "+i);
                }
            }
        }
    }
}