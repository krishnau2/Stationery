require 'rubygems'
require 'sinatra'
require 'rack-flash'
enable :sessions
use Rack::Flash

require 'active_record'
ActiveRecord::Base.establish_connection(
  :adapter  => "mysql",
  :host     => "localhost",
  :username => "root",
  :password => "",
  :database => "rStationery"
)

require 'models.rb'

require 'utils.rb'

require 'controllers/items.rb'
require 'controllers/categories.rb'
require 'controllers/purchase.rb'
require 'controllers/categories.rb'
require 'controllers/suppliers.rb'
require 'controllers/consumption.rb'
require 'controllers/units.rb'
require 'controllers/home.rb'