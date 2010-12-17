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

  #  if supplier name is given then filters with supplier name , start date, end date.
  #  Here the date field for filtering is the GR DATE.
  unless supplier == ""
    sup_id=Supplier.find(:all, :conditions =>{:name =>supplier })
    @selected_purchase=Purchase.find(:all, :order => "supplier_id",:conditions =>
        {:supplier_id =>sup_id ,:gr_date =>start_date..end_date}) unless start_date.blank? or end_date.blank?
    erb :"suppliers/supplier_report"
    #    if supplier name is not selected then supplier wise report for all suppliers for the given date intervel is taken
  else
    @selected_purchase=Purchase.find(:all, :order => "supplier_id",:conditions =>
        {:gr_date =>start_date..end_date}) unless start_date.blank? or end_date.blank?
    erb :"suppliers/supplier_report"
  end
end

get '/suppliers/edit/:supplier_id' do # for editing a supplier information.
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
  if params[:supplier_id].nil? # If supplier id is not there then it is a new entry
    i=Supplier.new
  else # if supplier id is there then this is an update operation for the existing supplier
    i=Supplier.find(params[:supplier_id].to_i)
  end

  i.name = params[:supplierName]
  i.address = params[:supplierAddress]
  i.save

  flash_message "Supplier datails saved."
  redirect '/suppliers/list'
end