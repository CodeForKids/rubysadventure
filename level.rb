require 'json'

class Level

  def initialize(file)
    json = JSON.parse File.read file
    @privileges = Privileges.new
    @privileges.allow (json["privileges"] || "")
  end

  def execute(code)
    s = Sandbox.new
    value = nil
    output = with_captured_stdout { value = s.run(@privileges, code)}
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