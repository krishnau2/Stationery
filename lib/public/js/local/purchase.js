var newId=1;
var amount;
var rate;
var quantity;
var total=0;
var row;

$(document).ready(function(){
    $('#billDate').datepicker({
        dateFormat: 'yy-mm-dd'
    });
    $('#grDate').datepicker({
        dateFormat: 'yy-mm-dd'
    });

    $("#rate").numeric();
    $("#quantity").numeric();
    // removed because current date is used as deDate
    //    $('#deDate').datepicker({
    //        dateFormat: 'yy-mm-dd'
    //    });

    $('input.total').attr("readonly", "true");

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

    $("input.rate").change(function(){
        row=$(this).parent().parent();
        quantity=$(row).find("input.quantity").val();
        rate=$(row).find("input.rate").val();
        amount=rate*quantity;
        $(row).find("input.amount").val(amount);
        calculateTotal();
    });
    
    $("input.quantity").change(function(){
        row=$(this).parent().parent();
        quantity=$(row).find("input.quantity").val();
        rate=$(row).find("input.rate").val();
        amount=rate*quantity;
        $(row).find("input.amount").val(amount);
        calculateTotal();
    })
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
    $('#amount').val("0");
    //     Clone and append the template.
    $('#purchase_details').append($('#details_template').clone(true).attr('id','row'+newId));
    if((newId % 2)==0){
        $("#row"+newId).css("background-color", "white");
    }
    else{
        $("#row"+newId).css("background-color", "#EBEBEB");
    }
    var newRow = $("#row"+newId);
    newRow.show();

    // Remove all Blurs from every existing amount. We need blur only for the last row we appended.
    $('input.amount').attr("readonly", "true");
    $("input.rate").unbind('blur');

    // Giving name attribute to every elaments of row
    newRow.find("#itemName").attr('name', 'row'+newId+'_itemName');
    newRow.find("#quantity").attr('name', 'row'+newId+'_quantity');
    newRow.find("#rate").attr('name', 'row'+newId+'_rate');
    newRow.find("#amount").attr('name', 'row'+newId+'_amount');
    newRow.find("#category").attr('name', 'row'+newId+'_category');
    newRow.find("#subcategory").attr('name', 'row'+newId+'_subcategory');
    // Creating new row when "rate" field of the current row is get out of focus.
    newRow.find("#rate").blur( function() {
        nextRow=createRow();
        nextRow.find("#category").focus();
    });
    newId=newId+1;
    return newRow
}

function calculateTotal(){
    var i=1;
    total=0;
    amount=0;
    for(i=1;i<newId;i++){
        row="#row"+i;
        if(!isNaN($(row).find("input.amount").val())){
            total=total+parseFloat($(row).find("input.amount").val(),10);
        }
    }
    $("#total").val(total);
}