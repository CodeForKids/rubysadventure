require 'sinatra'
require 'sinatra/assetpack'
require 'sinatra/activerecord'
require "rubygems"
require "shikashi"

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

  get '/level/:id' do
    "Hello World!"
  end

  post '/level/:id' do
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

end
