#config.ru
require 'rubygems'
require 'bundler'
Bundler.setup(:default)
require 'sinatra'
require 'active_record'
require 'sinatra/activerecord'
require './server.rb'


use Rack::Deflater
run RubysAdventure
