require 'sinatra'
require 'active_record'

class Question < ActiveRecord::Base

end

get '/' do
  "Welcome to Ruby's Adventure!"
end

get '/hi' do
  "Hello World!"
end
