get '/units/new' do
  erb :"units/unit_edit"
end

get '/units/list' do
  erb :"units/unit_list"
end

get '/units/edit/:unit_id' do
  @unit_id = params[:unit_id].to_i
  i=Unit.find(@unit_id) rescue nil
  redirect '/units/list' if i.blank?

  @name=i.name
  erb :"units/unit_edit"
end

post '/units/save' do
  if params[:unitName].blank?
    flash_error "All values are required. Unit not saved."
    redirect '/units/new'
  end
  if params[:unit_id].nil?# If unit id is not there then it is a new entry
    i=Unit.new
  else # if unit id is there then this is an update operation for the existing unit
    i=Unit.find(params[:"unit_id"].to_i)
  end

  i.name = params[:unitName]
  i.save

  flash_message "Unit details saved."
  redirect '/units/list'
end
