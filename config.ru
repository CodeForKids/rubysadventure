#config.ru
require 'rubygems'
require 'sinatra'
require './server.rb'

run Sinatra::Application
