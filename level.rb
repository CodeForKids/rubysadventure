require 'json'
require 'shikashi'

class Level

  def initialize(file)
    json = JSON.parse File.read file
    @privileges = Shikashi::Privileges.new
    allow_methods(@privileges, json["privileges"] || "puts")
    @answers = json["answers"]
  end

  def execute(question_number, code)
    s = Shikashi::Sandbox.new
    print(code)
    value = nil
    begin
    output = with_captured_stdout { value = s.run(@privileges, code)}
    rescue SecurityError => e
      # invalid code
    end
    check_answer(question_number, value || output || "")
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

  def check_answer(question_number, answer)
    actual_answer = @answers[question_number.to_i - 1].strip
    success = actual_answer == answer.strip
    {success: success, answer: actual_answer, user_answer:answer.strip}
  end

  def allow_methods(priv, *methods)
    methods.map {|m| priv.allow_method m.to_sym}
  end

end
