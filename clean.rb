require 'csv'
require 'json'

puts "\n---> Starting..."
export = {}

print '---> Getting fields descriptions... '
fields = {}
CSV.foreach('raw/column_descriptions.csv') do |(field, description)|
  fields[field.downcase.gsub(/\s/, '_').to_sym] = description
end
puts 'Done.'

print '---> Getting response descriptions... '
response_descriptions = {}
CSV.foreach('raw/response_descriptions.csv') do |(id, question, description, type)|
  ids = id.downcase.split('_')
  question_id = ids.first.to_sym
  response_id = ids.last.to_sym
  response_descriptions[question_id] ||= {
    question: question
  }
  response_descriptions[question_id][response_id] = {
    description: description,
    type: type
  }
end
puts 'Done.'

print '---> Getting data... '
data = {}
CSV.foreach('raw/responses.csv') do |row|
  ids = row[0].downcase.split('_')
  question_id = ids.first.to_sym
  response_id = ids.last.to_sym
  data[question_id] ||= {
    question: response_descriptions[question_id][:question],
    responses: []
  }
  response = { response: response_descriptions[question_id][response_id] }
  fields.keys[1..-1].each_with_index do |field, index|
    response[field] = row[index + 1].to_i
  end
  data[question_id][:responses] << response
end
puts 'Done.'

print '---> Cleaning up data... '
data = data.map { |questino_id, stats| stats }
data[0][:responses][0].delete(:response)
puts 'Done.'

print '---> Preparing export... '
export[:fields] = fields
export[:surveyed_count] = data[0][:responses][0]
export[:responses] = data[1..-1]
puts 'Done.'

print '---> Saving data... '
File.write('data.json', export.to_json)
puts 'Done.'

puts "\n---> Finished!"
