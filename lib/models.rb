require 'rubygems'
require 'active_record'

class Item < ActiveRecord::Base
end

class Supplier < ActiveRecord::Base
end

class Purchase < ActiveRecord::Base
  belongs_to :supplier
  has_many :purchase_details
#  def total_amount
#    PurchaseDetail.find(:all, :conditions => {:purchase_id => id})
#  end
end

class PurchaseDetail < ActiveRecord::Base
  belongs_to :item
  has_one :purchase
end

class Category < ActiveRecord::Base
end

def category_names_list
  Category.find_by_sql("select distinct category from categories")
end
