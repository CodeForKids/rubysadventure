require 'sinatra'
require 'sass'
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

  get '/levels/:id' do
    lvl_json = File.read(level_path(id)).to_json
  end

  post '/levels/:id/execute' do
    json = JSON.parse(request.body.read).to_hash
    code = json["code"] || ""
    question = json["question"].to_i || 1
    lvl = Level.new(level_path(params[:id]))
    resp = lvl.execute(question, code)
    if resp[:success]
      session[:level] ||= {}
      session[:level][:question] = json["json"].to_i
      session[:level][:id] = params[:id]
    end
    resp.to_json
  end

  private
  def level_path(id)
    "public/levels/#{id.to_i}.json"
  end

end
