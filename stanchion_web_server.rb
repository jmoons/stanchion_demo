require 'sinatra'
require 'json'
require 'digest/md5'

get '/' do
  send_file 'to_player/index.html'
end

get '/debug' do
  send_file 'to_player/debug.html'
end

get '/demo' do
  send_file 'to_player/demo_index.html'
end

get '/js/:file' do
  send_file('to_player/js/'+params[:file], :disposition => 'inline')
end

get '/css/:file' do
  send_file('to_player/css/'+params[:file], :disposition => 'inline')
end

get '/images/:file' do
  send_file('to_player/images/'+params[:file], :disposition => 'inline')
end

get '/outgoing_stanchion_data_*' do
  headers "Access-Control-Allow-Origin" => "*"

  type = params['splat'][0]

  if File.exists?("posted_data/output.#{type}")
    headers "MD5_SUM"                       => Digest::MD5.hexdigest(File.read("posted_data/output.#{type}"))
    headers "Access-Control-Expose-Headers" => "MD5_SUM"
    send_file "posted_data/output.#{type}"
  else
    status 404
  end
end

post '/incoming_stanchion_data_*' do
  type = params['splat'][0]

  content_type type.to_sym
  output_file( request.body.read, type )

  redirect "/outgoing_stanchion_data_#{type}", 303
end

def output_file(content, type)
  Dir.mkdir("posted_data") unless Dir.exists?("posted_data")
  File.open("posted_data/output.#{type}", 'w') do | file |
    file.write(content)
  end
end