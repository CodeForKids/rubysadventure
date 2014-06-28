require 'json'

class Level

  def initialize(file)
    json = JSON.parse File.read file
    @privileges = Privileges.new
    @privileges.allow_method :print
    @allowed_methods = Privileges::AllowedMethods.new
    # @allowed_methods.allow (json["privileges"] || "")
    @allowed_methods.allow_all
    @answers = json["answers"]
  end

  def execute(code)
    s = Sandbox.new
    print(code)
    value = nil
    output = with_captured_stdout { value = s.run(@privileges, code)}
    check_answer(value || output)
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

  def check_answer(answer)
    {success:@answers[0] == answer, answer:@answers[0], user_answer:answer}
  end

end