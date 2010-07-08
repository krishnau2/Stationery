get '/consumption/new' do
  erb :"consumption/consumption_new"
end

get '/consumption/list' do
  erb :"consumption/consumption_list"
end

post '/consumption/new' do
  params.delete "category"
  consumeDate = params.delete "consumeDate"
  forUnit = params.delete "forUnit"
  user = params.delete "user"

  item_details_exist=false

  data=create_hash_from_html_post params  # discards the keyname "row1" "row2" etc. Gets the actual value in each row.
  data.each {|keyname, row|
    next if row["itemName"].nil?    # Skip it if it is a blank row.

    unless row["itemName"].blank?
      item_details_exist=true
    else
      item_details_exist=false
    end
    
    x=Item.find(:all, :conditions => {:category => row["category"], :subcategory => row["subcategory"],
        :description => row["itemName"]}).first

    next if x.nil?

    if item_details_exist
      consumption=Consumption.new
      consumption.product_id=x['id']
      consumption.quantity = row["quantity"].to_f
      consumption.consume_date = consumeDate
      consumption.for_unit = forUnit
      consumption.user = user
      consumption.save
    end
  }
  redirect '/consumption/list'
end
# For calculating the available stock of the selected item. (AJAX request)
post '/consumption/get_available_stock' do
  params[:category].strip!
  params[:subcategory].strip!
  params[:itemName].strip!
#  getting the item_id of the selected item from the ITEM MASTER
  x=Item.find(:all, :conditions => {:category => params[:category], :subcategory => params[:subcategory],
      :description => params[:itemName]}).first
  item_id=x['id']

#  Calculation of available stock of selected item
  available_stock_qty_of_selected_item=total_purchase_qty_of_selected_item(item_id) - total_consumption_qty_of_selected_item(item_id)
#  converting it to JSON
  available_stock_qty_of_selected_item.to_json
end

def total_purchase_qty_of_selected_item(item_id)
  PurchaseDetail.sum(:quantity, :conditions =>{:item_id =>item_id})
end

def total_consumption_qty_of_selected_item(item_id)
  Consumption.sum(:quantity, :conditions =>{:product_id =>item_id})
end