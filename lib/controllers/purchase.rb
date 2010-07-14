get '/purchase/new' do
  erb :"purchase/purchase_new"
end

get '/purchase/list' do
  erb :"purchase/purchase_list"
end

get '/purchase/report' do
  erb :"purchase/purchase_report"
end

get '/purchase/detail/:purchase_id' do
  @purchase_id = params[:purchase_id].to_i
  erb :"purchase/purchase_detail"
end

post '/purchase/report' do
  start_date = params.delete "start_date"
  end_date = params.delete "end_date"

  @st_date=start_date
  @en_date=end_date
  
  @selected_purchase=Purchase.find(:all, :order => "gr_date",:conditions =>
      {:gr_date =>start_date..end_date}) unless start_date.blank? or end_date.blank?
  erb :"/purchase/purchase_report"
end


post '/purchase/new' do
  params.delete "category"
  supplier_name = params.delete "supplierName"
  bill_no=params.delete "billNo"
  gr_date=params.delete "grDate"
  total_amount=params.delete "total"
  #  current date is used as the dedate
  #  de_date=params.delete "deDate"
  bill_date=params.delete "billDate"

  item_details_exist=false
  purchase_entry_saved=false

  unless params[:row1_itemName].blank?
    item_details_exist=true
    purchase_entry_saved=true
  end

  if item_details_exist
    p=Purchase.new
    p.bill_date = bill_date
    p.bill_no = bill_no
    p.gr_date = gr_date
    p.total_amount=total_amount
    p.de_date = Date.today
    p.supplier_id = Supplier.find_by_name(supplier_name).id
    p.save
  end

  data=create_hash_from_html_post params  # discards the keyname "row1" "row2" etc. Gets the actual value in each row.
  data.each {|keyname, row|
    next if row["itemName"].nil?    # Skip it if it is a blank row.

    x=Item.find(:all, :conditions => {:category => row["category"], :subcategory => row["subcategory"],
        :description => row["itemName"]}).first

    next if x.nil?

    pd=PurchaseDetail.new
    pd.purchase_id=p.id
    pd.item_id=x['id']
    pd.quantity = row["quantity"].to_f
    pd.rate = row["rate"].to_f
    pd.amount = pd.quantity * pd.rate
    pd.save
    item_details_exist=true
  }
  if purchase_entry_saved
    redirect '/purchase/list'
  else
    redirect '/purchase/new'
  end
end