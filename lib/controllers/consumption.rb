get '/consumption/new' do
  erb :"consumption/consumption_new"
end

get '/consumption/list' do
  erb :"consumption/consumption_list"
end

get '/consumption/report' do
  erb :"consumption/consumption_report"
end

post '/consumption/report' do
  start_date = params.delete "start_date"
  end_date = params.delete "end_date"
  
  @consumption=Consumption.find(:all, :order => "consume_date",:conditions =>
      {:consume_date =>start_date..end_date}) unless start_date.blank? or end_date.blank?
  erb :"/consumption/consumption_report"
end

post '/consumption/new' do
  params.delete "category"
  consumeDate = params.delete "consumeDate"
  forUnit = params.delete "forUnit"
  user = params.delete "user"

  #  flag for checking blank row.
  item_details_exist=false
  #  flag for checking stock availability.
  stock_available=false

  data=create_hash_from_html_post params  # discards the keyname "row1" "row2" etc. Gets the actual value in each row.
  #  Checks the available stock for each item
  data.each { |kename,row|
    next if row["itemName"].nil?    #Skip it if it is a blank row.
    #    Searching the particular item from the master
    x=Item.find(:all, :conditions => {:category => row["category"], :subcategory => row["subcategory"],
        :description => row["itemName"]}).first
    unless x.nil?
      item_id=x['id']
      #      Calculating the available balance of each item
      available=calculate_available_stock(item_id)
      break if available <= 0 # Breaks from the loop when atleast one item dont have enough balance quantity.
      stock_available=true
    end
  } # stock_available is false if any item dont have enough balance quantity.
  # Saving the consumption details to database.
  if stock_available
    data.each {|keyname, row|
      next if row["itemName"].nil?    # Skip it if it is a blank row.

      unless row["itemName"].blank?
        item_details_exist=true
      else
        item_details_exist=false
      end
      # Getting the item details from the maste
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
      flash_message "Consumption details are saved successfully."
    }
  else
    flash_error "Consumption not saved ; Available quantity may be less for some items please go back and check."
  end
  redirect '/consumption/list'
  
end # End of new consumption


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
  available_stock_qty_of_selected_item=calculate_available_stock(item_id)
  #  converting it to JSON
  available_stock_qty_of_selected_item.to_json
end
