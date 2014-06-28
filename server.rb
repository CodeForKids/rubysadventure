require 'sinatra'
require 'active_record'
require 'sinatra/assetpack'

class Question < ActiveRecord::Base

end

class RubysAdventure < Sinatra::Base

  assets {
    serve '/css', from: 'public/css'
    css :app , ['/css/*.css']
  }
  set :public_folder, 'public'

  get '/' do
    "Welcome to Ruby's Adventure!"
  end

  get '/hi' do
    "Hello World!"
  end

end