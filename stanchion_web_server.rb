require 'sinatra'
require 'json'

get '/' do
  send_file 'to_player/index.html'
end

get '/debug' do
  send_file 'to_player/debug.html'
end

get '/js/:file' do
  send_file('to_player/js/'+params[:file], :disposition => 'inline')
end

get '/css/:file' do
  send_file('to_player/css/'+params[:file], :disposition => 'inline')
end

get '/outgoing_stanchion_data_json' do
  if File.exists?('posted_data/output.json')
    send_file 'posted_data/output.json'
  else
    status 404
    send_file('to_player/four_oh_four.html')
  end
end

get '/outgoing_stanchion_data_xml' do
  if File.exists?('posted_data/output.xml')
    send_file 'posted_data/output.xml'
  else
    status 404
    send_file('to_player/four_oh_four.html')
  end
end

post '/incoming_stanchion_data_json' do
  content_type :json
  output_file( request.body.read, "json" )

  redirect '/outgoing_stanchion_data_json', 303
end

post '/incoming_stanchion_data_xml' do
  content_type :xml
  output_file( request.body.read, "xml" )

  redirect '/outgoing_stanchion_data_xml', 303
end

def output_file(content, type)
  Dir.mkdir("posted_data") unless Dir.exists?("posted_data")
  File.open("posted_data/output.#{type}", 'w') do | file |
    file.write(content)
  end
end