require 'json'
events = []
File.open("./event.txt", "r").each_line do |line|
  parts = line.split ":"
  command = parts[0]
  params = (parts.length > 1) ? parts[1].split(",").map(&:strip) : []
  case command
  when "target"
    events << { trigger: params[0], params: params[1..-1], actions: [] }
  when "action"
    events.last[:actions] << { trigger: params[0], params: params[1..-1]}
  else
    puts "Invalid line encountered skipping"
  end
end
File.open("events.json", "w") {|f| f.puts events.to_json}