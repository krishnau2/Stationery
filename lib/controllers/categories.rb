get '/category/new' do
  erb :"categories/category_edit"
end

get '/category/list' do
  erb :"categories/category_list"
end

get '/category/edit/:category_id' do
  
  @category_id = params[:category_id].to_i
  i= Category.find(@category_id) rescue nil
  redirect '/category/list' if i.blank?

  @category=i.category
  @subcategory=i.subcategory
  erb :"categories/category_edit"
end

post '/category/save' do
  if params[:category].blank? or params[:subcategory].blank?
    flash_error "All values are required. Data not saved."
    redirect '/category/new'
  end
  if params[:category_id].nil?
    i=Category.new
  else
    i=Category.find(params[:category_id].to_i)
  end

  i.category = params[:category]
  i.subcategory = params[:subcategory]
  i.save

  flash_message "Category & Subcategory datails saved."
  redirect '/category/list'
end

post '/category/get_subcategories' do # AJAX request for subcategories for the selected category
  params[:category].strip!
  Category.find(:all, :conditions => {:category => params[:category]}).collect {|row| row["subcategory"]}.to_json
end


def select_category_partial(already_selected_category)
  @already_selected_category = already_selected_category
  erb :'categories/select_category_partial', :layout => false
end

def select_subcategory_partial
  erb :'categories/select_subcategory_partial', :layout => false
end

