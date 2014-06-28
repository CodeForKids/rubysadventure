require 'sinatra'
require 'sinatra/assetpack'
require 'sinatra/activerecord'
require "rubygems"
require "shikashi"
require "sinatra/json"
require './level.rb'

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
    send_file "#{level_path(params[:id])}"
  end

  post '/levels/:id/execute' do
    my_json = JSON.parse(request.body.read).to_hash
    lvl = Level.new(level_path(params[:id]))
    lvl.execute(my_json["code"] || "").to_json
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

  def with_captured_stdout
    begin
      old_stdout = $stdout
      $stdout = StringIO.new('','w')
    yield
      $stdout.string
    ensure
      $stdout = old_stdout
    end
  end

  def level_path(id)
    "public/level_#{id.to_i}.json"
  end

end
