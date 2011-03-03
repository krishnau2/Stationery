require 'rubygems'
#require 'sinatra'
#require 'rack-flash'
enable :sessions
use Rack::Flash

require 'active_record'
ActiveRecord::Base.establish_connection(
  :adapter  => "mysql",
  :host     => "127.0.0.1",
  :username => "root",
  :password => "",
  :database => "rStationery"
)

set :views, File.dirname(__FILE__) + '/views'
set :public, File.dirname(__FILE__) + '/public'

root = File.expand_path(File.dirname(__FILE__))

require "#{root}/models.rb"
#require './models.rb'

require "#{root}/utils.rb"

require "#{root}/controllers/items.rb"
require "#{root}/controllers/categories.rb"
require "#{root}/controllers/purchase.rb"
require "#{root}/controllers/categories.rb"
require "#{root}/controllers/suppliers.rb"
require "#{root}/controllers/consumption.rb"
require "#{root}/controllers/units.rb"
require "#{root}/controllers/home.rb"