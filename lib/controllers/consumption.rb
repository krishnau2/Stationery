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