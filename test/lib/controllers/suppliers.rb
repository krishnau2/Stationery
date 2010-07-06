get '/suppliers/new' do
  erb :"suppliers/supplier_edit"
end

get '/suppliers/list' do
  erb :"suppliers/supplier_list"
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