#config.ru
require 'rubygems'
require 'sinatra'
require 'active_record'
require 'sinatra/activerecord'
require './server.rb'

run Sinatra::Application
