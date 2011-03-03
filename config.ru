require 'rubygems'
require 'bundler'

Bundler.require

require "#{File.expand_path(File.dirname(__FILE__))}/lib/main.rb"

run Sinatra::Application
