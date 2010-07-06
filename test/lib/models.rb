require 'rubygems'
require 'active_record'

class Item < ActiveRecord::Base
end

class Supplier < ActiveRecord::Base
end

class Purchase < ActiveRecord::Base
  belongs_to :supplier
  has_many :purchase_details
end

class PurchaseDetail < ActiveRecord::Base
  belongs_to :item
  has_one :purchase
end

class Consumption < ActiveRecord::Base
  belongs_to :item
end

class Category < ActiveRecord::Base
end

def category_names_list
  Category.find_by_sql("select distinct category from categories")
end
