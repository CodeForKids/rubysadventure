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

    send_file "public/level#{params[:id].to_i}.json"
  end

  post '/levels/:id/execute' do
    my_json = JSON.parse(request.body.read).to_hash
    json check_answer(params[:id], my_json["code"])
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

  def check_answer(id, answer)
    json = JSON.parse(File.read("public/level#{id.to_i}answers.json"))
    {success:json["answer1"] == answer, answer:json["answer1"], user_answer:answer, json:json}
  end

end
