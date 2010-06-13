get '/items' do
  redirect '/items/list'
end

get '/items/new' do
  erb :"items/item_edit"
end

get '/items/edit/:item_id' do

  @item_id=params[:item_id].to_i
  i=Item.find(@item_id) rescue nil
  redirect '/items/list' if i.blank?

  @description = i.description
  @category = i.category
  @subcategory = i.subcategory
  @reorder = i.reorder_level
  erb :"items/item_edit"
end

post '/items/save' do
  if params[:category].blank? or params[:subcategory].blank? or params[:description].blank?
    flash_error "All values are required. Item not saved."
    redirect '/items/new'
  end

  if params[:item_id].nil?
    i=Item.new
  else
    i=Item.find(params[:item_id].to_i)    # Existing item, update the record.
  end
  
  i.description = params[:description]
  i.category = params[:category]
  i.subcategory = params[:subcategory]
  i.reorder_level = params[:reorder]
  i.save

  flash_message "Item details saved."
  redirect '/items/list'
end

get '/items/list' do
  erb :"items/item_list"
end


#Used in Ajax requests (purchase and sales)
post '/items/get_description' do
  params[:category].strip!
  params[:subcategory].strip!

  Item.find(:all, :conditions =>
      {:category => params[:category], :subcategory => params[:subcategory]}).
    collect {|row| row["description"]}.to_json
end