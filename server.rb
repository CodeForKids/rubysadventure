require 'sinatra'
require 'sinatra/assetpack'
require 'sinatra/activerecord'
require "rubygems"
require "shikashi"
require "sinatra/json"

include Shikashi

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
    send_file "#{level_path(params[:id])}.json"
  end

  post '/level/:id/execute' do
    lvl = Level.new(level_path(params[:id]))
    lvl.execute(params[:code] || "")
  end

  get '/test' do
    code = params[:code] || ""
    s = Sandbox.new
    foo = StringIO.new
    priv = Privileges.new
    priv.allow_method :print
    priv.allow_method :gsub
    value = nil
    output = with_captured_stdout { value = s.run(priv, code)}
    value || output
  end

  private

  def level_path(id)
    "public/level_#{id.to_i}"
  end

end
