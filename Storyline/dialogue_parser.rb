require 'json'
array = []
File.open('dialogue','r').each_line  do |line|
  unless line.strip.empty?
    parts = line.split ":"
    hash = {character:parts[0].split(" ").first,
    type:parts[0].include?("(TQ)") ? "thought" : "dialogue",
    dialogue:parts[1]}
    array << hash
  end
end

new_file = File.open('my_json.json', 'w') {|f| f.puts(array.to_json)}
