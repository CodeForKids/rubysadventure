require "rubygems"
 require "shikashi"

 include Shikashi

 sandbox = Sandbox.new
 privileges = Privileges.new
 privileges.allow_method :print
 sandbox.run('print "hello world\n"', :privileges => privileges)
