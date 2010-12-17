def flash_message(message)
  flash[:message]=message
end

def flash_error(message)
  flash[:error]=message
end

#------------------
#Table-editable dynamic pages in this system returns POST data of the form: ROWID_profile or ROWID_verbiage
#the ROWID may be immaterial, or might be some primary key.
#
# params={"table1_column1_operator" => "Addition", "table1_column1_text" => "Test",
# "table1_column2_operator" => "Change", "table1_column2_text" => "Test2",
# "table2_column1_operator" => "Subtraction", "table2_column1_text" => "SWW",
# "table2_column2_operator" => "Multiplication", "table2_column2_text" => "DFD"
#}
#
# becomes:
# { table1 => {
# column1 => {operator: "Addition", text: "Test"},
# column2 => {operator: "Change", text: "Test2"},
# },
# table2 => {
# column1 => {operator: "Subtraction", text: "SWW"},
# column2 => {operator: "Multiplication", text: "DFD"}
# }
# }
#
# Any level of Nesting is okay. But if the delimeted words have an extra _,
# they will be treated as a nesting level. For this, preferably use a rare
# delimiter (like __)

def create_hash_from_html_post (params, delimiter = "_")
  #http://snippets.dzone.com/posts/show/4146
  #create nested hash automatically.
  hashOutput= Hash.new{|h,k| h[k]=Hash.new(&h.default_proc) }

  params.each { |key, value|
    #avoid code execution of malicious post data.
    key.gsub!(";",""); key.gsub!("'",""); key.gsub!("\\",""); key.gsub!("/",""); key.gsub!('"',"")

    hash_keys=key.split(delimiter); last_key=hash_keys.delete(hash_keys.last)

    currentHashPosition=hashOutput; hash_keys.each { |k| currentHashPosition=currentHashPosition[k]; }
    currentHashPosition[last_key]=value
  }
  hashOutput.freeze #has some special properties - manipulating it gives u wrong results. freeze it for the unwary.
  return hashOutput
end

def calculate_available_stock(item_id) # for calculating available stock for the Item master report
  total_purchase_qty_of_selected_item(item_id) - total_consumption_qty_of_selected_item(item_id)
end

def total_purchase_qty_of_selected_item(item_id)
  PurchaseDetail.sum(:quantity, :conditions =>{:item_id =>item_id})
end

def total_consumption_qty_of_selected_item(item_id)
  Consumption.sum(:quantity, :conditions =>{:product_id =>item_id})
end

def last_purchase_price(item_id) # for finding the last purchase price of the given item for the Item master report
  PurchaseDetail.find(:all, :conditions =>{:item_id =>item_id},:order => "purchase_id desc",:limit => 1).collect {|row| row["rate"]}
end

# for the finding the no of bills of a supplier for a given period of time
def supplier_wise_bill_count(supplier_id,start_date,end_date)
  Purchase.count(:conditions =>{:supplier_id =>supplier_id,:bill_date =>start_date..end_date})
end