get '/' do
  erb :'home', :layout => false
end

get '/home' do
  erb :'home', :layout => false
end