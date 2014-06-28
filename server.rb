require 'sinatra'
require 'sinatra/assetpack'


class RubysAdventure < Sinatra::Base
  register Sinatra::AssetPack
  register Sinatra::ActiveRecordExtension

  enable :sessions
  
  assets {
    serve '/css', from: 'public/css'
    css :app , ['/css/*.css']
    serve '/js', from: 'public/js'
    js :app , ['js/*.js']
  }
  set :public_folder, 'public'

  get '/' do
    "Welcome to Ruby's Adventure!"
  end

  get '/level/:id' do
    "Hello World!"
  end

  post '/level/:id' do
  end

end