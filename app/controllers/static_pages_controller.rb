require 'twitter'

class StaticPagesController < ApplicationController
  def home
  	#@client = Twitter::Client.new(consumer_key: "YWkWeFaQRGRybI0NYNrYiw",
	#	  consumer_secret: "1X7sroA9I3rRPzBT69cnnWIhKNeBUf4bGwF8CzTE",
	#	  oauth_token: "15854229-iTEQDEixW4JLltrgr4EB9vYY75RNag4CsjC9er0SC",
	#	  oauth_token_secret: "iEyRUAdxp7UFXx7uIAlFRATl39KnSCCp472nTVtxhrI")
	#client = Twitter::REST::Client.new do |config|
	#  config.consumer_key        = "YWkWeFaQRGRybI0NYNrYiw"
	#  config.consumer_secret     = "1X7sroA9I3rRPzBT69cnnWIhKNeBUf4bGwF8CzTE"
	#  config.access_token        = "15854229-iTEQDEixW4JLltrgr4EB9vYY75RNag4CsjC9er0SC"
	#  config.access_token_secret = "iEyRUAdxp7UFXx7uIAlFRATl39KnSCCp472nTVtxhrI"
	#end
	#@tweet = client.search("#thatsongtho").first.text
  end

  def about
  end

  def contact
  end

  def help
  end

end
