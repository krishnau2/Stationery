get '/suppliers/new' do
  erb :"suppliers/supplier_edit"
end

get '/suppliers/list' do
  erb :"suppliers/supplier_list"
end

get '/suppliers/report' do
  erb :"suppliers/supplier_report"
end

post '/suppliers/report' do
  supplier = params.delete "supplierName"
  start_date = params.delete "start_date"
  end_date = params.delete "end_date"

  @st_date=start_date
  @en_date=end_date

  unless supplier == ""
    sup_id=Supplier.find(:all, :conditions =>{:name =>supplier })
    @selected_purchase=Purchase.find(:all, :order => "supplier_id",:conditions =>
        {:supplier_id =>sup_id ,:gr_date =>start_date..end_date}) unless start_date.blank? or end_date.blank?
    erb :"suppliers/supplier_report"
  else
    @selected_purchase=Purchase.find(:all, :order => "supplier_id",:conditions =>
        {:gr_date =>start_date..end_date}) unless start_date.blank? or end_date.blank?
    erb :"suppliers/supplier_report"
  end
  
end

get '/suppliers/edit/:supplier_id' do
  @supplier_id = params[:supplier_id].to_i
  i= Supplier.find(@supplier_id) rescue nil
  redirect '/suppliers/list' if i.blank?

  @name=i.name
  @address=i.address
  erb :"suppliers/supplier_edit"
end

post '/suppliers/save' do
  if params[:supplierName].blank? or params[:supplierAddress].blank?
    flash_error "All values are required. Supplier not saved."
    redirect '/suppliers/new'
  end
  if params[:supplier_id].nil?
    i=Supplier.new
  else
    i=Supplier.find(params[:supplier_id].to_i)
  end

  i.name = params[:supplierName]
  i.address = params[:supplierAddress]
  i.save

  flash_message "Supplier datails saved."
  redirect '/suppliers/list'
end