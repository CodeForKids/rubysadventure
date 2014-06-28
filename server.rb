require 'sinatra'
require 'sinatra/assetpack'
require 'sinatra/activerecord'
require "rubygems"
require "shikashi"
require "sinatra/json"
require './level.rb'

class RubysAdventure < Sinatra::Base
  register Sinatra::AssetPack
  register Sinatra::ActiveRecordExtension
  helpers  Sinatra::JSON

  set :root, File.dirname(__FILE__)

  enable :sessions

  assets {
    css :app , ['/css/*.css']
    js :app , ['/js/**/*.js']
  }
  set :public_folder, 'public'

  get '/' do
    erb :index
  end

  post '/levels/:id/execute' do
    my_json = JSON.parse(request.body.read).to_hash
    lvl = Level.new(level_path(params[:id]))
    code = my_json["code"] || ""
    question_number = my_json["question_number"] || "1"
    lvl.execute(question_number, code).to_json
  end

  private

  def level_path(id)
    "public/levels/#{id.to_i}.json"
  end

end
