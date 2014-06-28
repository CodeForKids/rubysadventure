require 'sinatra'
require 'sinatra/assetpack'
require 'sinatra/activerecord'

class RubysAdventure < Sinatra::Base
  register Sinatra::AssetPack
  register Sinatra::ActiveRecordExtension

  set :root, File.dirname(__FILE__)

  enable :sessions

  assets {

    css :app , ['/css/*.css']
    js :app , ['js/*.js']
  }
  set :public_folder, 'public'

  get '/' do
    erb :index
  end

  get '/chapter/:cid/question/:qid' do
    "Hello World!"
  end

  post '/chapter/:cid/question/:qid' do
  end

end
