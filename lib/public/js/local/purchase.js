var newId=1;
var amount;
var rate;
var quantity;
var tax_amount=0;
var total=0;
var grand_total=0;
var cess_amount =0;
var selected_unit = "";
var row;

$(document).ready(function(){
    $('#billDate').datepicker({
        dateFormat: 'yy-mm-dd'
    });
    $('#grDate').datepicker({
        dateFormat: 'yy-mm-dd'
    });
    //    for report section
    $('#start_date').datepicker({
        dateFormat: 'yy-mm-dd'

    });

    $('#end_date').datepicker({
        dateFormat: 'yy-mm-dd'
    });
    
    $("#total").val(0);
    $("#grand_total").val(0);
    $("#cess_amount").val(0);

    $("#rate").numeric();
    $("#quantity").numeric();
    $("#tax_amount").numeric();
    $("#total").numeric();
    $("#cess_amount").numeric();
    $("#grand_total").numeric();
    // removed because current date is used as deDate
    //    $('#deDate').datepicker({
    //        dateFormat: 'yy-mm-dd'
    //    });

    $('input.total').attr("readonly", "true");
    $('input.grand_total').attr("readonly", "true");

    $("#edit_control").toggle(
        function(){
            $('#total').removeAttr("readonly");
            $('#grand_total').removeAttr("readonly");
            $(this).text("Lock");
        },
        function(){
            $('#total').attr("readonly",true);
            $('#grand_total').attr("readonly",true);
            $(this).text("Unlock");
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
    
    $("input.quantity").change(function(){
        tax_amount = 0;
        row=$(this).parent().parent();
        quantity=$(row).find("input.quantity").val();
        rate=$(row).find("input.rate").val();
        if($(row).find("input.tax_amount").val() != ""){
            tax_amount=parseFloat($(row).find("input.tax_amount").val(),10);
        }
        amount=rate*quantity+tax_amount;
        $(row).find("input.amount").val(amount);
        calculateTotal();
    });

    $("input.rate").change(function(){
        row=$(this).parent().parent();
        quantity=$(row).find("input.quantity").val();
        rate=$(row).find("input.rate").val();
        if($(row).find("input.tax_amount").val() != ""){
            tax_amount=parseFloat($(row).find("input.tax_amount").val(),10);
        }
        amount=rate*quantity+tax_amount;
        $(row).find("input.amount").val(amount);
        calculateTotal();
    });

    $("input.tax_amount").change(function(){
        row=$(this).parent().parent();
        quantity=$(row).find("input.quantity").val();
        rate=$(row).find("input.rate").val();
        if($(row).find("input.tax_amount").val() != ""){
            tax_amount=parseFloat($(row).find("input.tax_amount").val(),10);
        }
        amount=rate*quantity+tax_amount;
        $(row).find("input.amount").val(amount);
        calculateTotal();
    });

    $("#cess_amount").change(function(){
        calculateTotal();
    })

    
    
    // On submition validating the entry fields.
    $('#savePurchase').click(function(e){
        static_entry_field_validation(e);
        recurring_entry_field_validation(e);
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
    $("input.tax_amount").unbind('blur');

    // Giving name attribute to every elaments of row
    newRow.find("#forUnit").attr('name', 'row'+newId+'_forUnit');
    newRow.find("#itemName").attr('name', 'row'+newId+'_itemName');
    newRow.find("#quantity").attr('name', 'row'+newId+'_quantity');
    newRow.find("#rate").attr('name', 'row'+newId+'_rate');
    newRow.find("#tax_amount").attr('name', 'row'+newId+'_taxAmount');
    newRow.find("#amount").attr('name', 'row'+newId+'_amount');
    newRow.find("#category").attr('name', 'row'+newId+'_category');
    newRow.find("#subcategory").attr('name', 'row'+newId+'_subcategory');
    // Creating new row when "rate" field of the current row is get out of focus.
    newRow.find("#tax_amount").blur( function() {
        nextRow=createRow();
        nextRow.find("#forUnit").focus();
    });
    newId=newId+1;
    return newRow
}

function static_entry_field_validation(e){

    if($('#billDate').val() == ""){
        e.preventDefault();
        alert("Please enter Bill date.");
    }
    else if($('#billNo').val() == ""){
        e.preventDefault();
        alert("Please enter Bill Number.");
    }
    else if($('#supplierName').val() == ""){
        e.preventDefault();
        alert("Please select a Supplier.");
    }
    else if($('#grDate').val() == ""){
        e.preventDefault();
        alert("Please enter GR date.");
    }

}

function recurring_entry_field_validation(e){
    var i=1;
    total=0;
    amount=0;
    var input_amount=0;
    var selectedCategory;
    var selectedSubategory;
    var itemName;
    var input_tax_amount;
    var input_quantity;
    var input_rate;
    // if new row is not have been created then "newId" will be 1.
    if(newId == 2){
        row="#row"+i;
        
        selectedCategory = $(row).find("select.category :selected").text();
        selectedSubategory = $(row).find("select.subcategory :selected").text();
        itemName = $(row).find("select.itemName :selected").text();
        input_quantity = $(row).find("input.quantity").val();
        input_rate = $(row).find("input.rate").val();
        input_tax_amount = $(row).find("input.tax_amount").val();
        input_amount = $(row).find("input.amount").val();

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
            if(input_rate == ""){
                e.preventDefault();
                alert("Rate should not be BLANK at line "+i);
            }
            else if(input_rate == 0){
                e.preventDefault();
                alert("Rate should not be ZERO at line "+i);
            }

            if(input_tax_amount == ""){
                e.preventDefault();
                alert("Tax amount should not be BLANK at line "+i);
            }
            if(input_amount == 0){
                e.preventDefault();
                alert("Amount should not be ZERO at line "+i);
            }
        }
    }
    // if new row is created then "newId" will be increased by one.
    // In loop "newId-1" is so selected to avoid the last row, because it is blank alltime.
    else{
        for(i=1;i < (newId-1);i++){
            row="#row"+i;

            selectedCategory = $(row).find("select.category :selected").text();
            selectedSubategory = $(row).find("select.subcategory :selected").text();
            itemName = $(row).find("select.itemName :selected").text();
            input_quantity = $(row).find("input.quantity").val();
            input_rate = $(row).find("input.rate").val();
            input_tax_amount = $(row).find("input.tax_amount").val();
            input_amount = $(row).find("input.amount").val();

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
                if(input_rate == ""){
                    e.preventDefault();
                    alert("Rate should not be BLANK at line "+i);
                }
                else if(input_rate == 0){
                    e.preventDefault();
                    alert("Rate should not be ZERO at line "+i);
                }
                if(input_tax_amount == ""){
                    e.preventDefault();
                    alert("Tax amount should not be blank."+i);
                }
                if(input_amount == 0 ){
                    e.preventDefault();
                    alert("Amount should not be ZERO. at line "+i);
                }
            }
        }
    }
}

function calculateTotal(){
    var i=1;
    total=0;
    amount=0;
    grand_total=0;
    cess_amount =0;
    for(i=1;i<newId;i++){
        row="#row"+i;
        if(!isNaN($(row).find("input.amount").val())){
            total=total+parseFloat($(row).find("input.amount").val(),10);
        }
    }

    if($("#cess_amount").val() != ""){
        cess_amount = parseFloat($("#cess_amount").val(),10);
    }
    grand_total = total + cess_amount;

    $("#total").val(total);
    $("#grand_total").val(grand_total);
}