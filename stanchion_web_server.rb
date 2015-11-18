require 'sinatra'
require 'active_support/core_ext/hash/conversions'
require 'json'

get '/' do
  "What Up Sucka, you are Home"
end

get '/homepage' do
  send_file 'to_player/index.html'
end

get '/js/:file' do
  send_file('to_player/js/'+params[:file], :disposition => 'inline')
end

get '/outgoing_stanchion_data_json' do
  send_file 'posted_data/output.json'
end

get '/outgoing_stanchion_data_xml' do
  send_file 'posted_data/output.xml'
end

get '/outgoing_stanchion_data_xml_to_json' do
  # the Hash method from_xml comes from ActiveSupport, not part of pure Ruby
  Hash.from_xml(File.open("posted_data/output.xml", "r").read).to_json
end

post '/incoming_stanchion_data_json' do
  content_type :json
  output_file( request.body.read, "json" )
end

post '/incoming_stanchion_data_xml' do
  content_type :xml
  output_file( request.body.read, "xml" )
  [201, {}, ['/outgoing_stanchion_data_xml']]
end

def output_file(content, type)
  File.open("posted_data/output.#{type}", 'w') do | file |
    file.write(content)
  end
end