get '/purchase/new' do
  erb :"purchase/purchase_new"
end

get '/purchase/list' do
  erb :"purchase/purchase_list"
end

get '/purchase/report' do
  erb :"purchase/purchase_report"
end

#for showing the details of a particular bill.
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
  cess_amount = params.delete "cess_amount"
  grand_total=params.delete "grand_total"
  #  current date is used as the dedate
  #  de_date=params.delete "deDate"
  bill_date=params.delete "billDate"

  purchase_details_exist = false
  item_details_exist=false
  purchase_entry_saved=false

  purchase_details_exist = true unless bill_date.blank? || supplier_name.blank? || bill_no.blank? || gr_date.blank?

  if purchase_details_exist
    unless params[:row1_itemName].blank?  # First row should not be left blank (explained below)
      item_details_exist=true
      purchase_entry_saved=true
    end
  end
  # If there is some item entry in the first row, then only the bill head details,
  # such as bill no, bill date, supplier name etc will be stored to the purchase database.
  # If some one enters the bill details and accidently saves the purchase then it should not be saved,
  # unless if the first row is filled.
  # item_details_exist is kept as false by default to prevent this.
  if item_details_exist && purchase_details_exist
    p=Purchase.new
    p.bill_date = bill_date
    p.bill_no = bill_no
    p.gr_date = gr_date
    p.cess_amount = cess_amount
    p.total_amount=grand_total
    p.de_date = Date.today
    p.supplier_id = Supplier.find_by_name(supplier_name).id
    p.save
  end

  data=create_hash_from_html_post params  # discards the key name "row1" "row2" etc. Gets the actual value in each row.
  data.each {|keyname, row|
    next if row["itemName"].nil?    # Skip it if it is a blank row. The last row may be blank
    # Finding the item_id of the selected item from Item master table.
    x=Item.find(:all, :conditions => {:category => row["category"], :subcategory => row["subcategory"],
        :description => row["itemName"]}).first

    next if x.nil?

    unless row["quantity"].blank? || row["rate"].blank?
      unit_id = Unit.find_by_name(row["forUnit"]).id
      pd=PurchaseDetail.new
      pd.unit = unit_id
      pd.purchase_id=p.id
      pd.item_id=x['id']
      pd.quantity = row["quantity"].to_f
      pd.rate = row["rate"].to_f
      pd.tax_amount = row["taxAmount"].to_f
      pd.amount = (pd.quantity * pd.rate) + pd.tax_amount
      pd.save
      item_details_exist=true
    end
  }
  if purchase_entry_saved
    #    if everything is gone well and the entries are stored in the database then redirect to the purchase list.
    redirect '/purchase/list'
  else
    redirect '/purchase/new'
  end
end