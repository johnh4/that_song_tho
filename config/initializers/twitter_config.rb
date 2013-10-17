require 'twitter'

#client = Twitter::REST::Client.new do |config|
#Twitter.configure do |config|
#  config.consumer_key        = "YWkWeFaQRGRybI0NYNrYiw"
#  config.consumer_secret     = "1X7sroA9I3rRPzBT69cnnWIhKNeBUf4bGwF8CzTE"
#  config.oauth_token        = "15854229-iTEQDEixW4JLltrgr4EB9vYY75RNag4CsjC9er0SC"
#  config.oauth_token_secret = "iEyRUAdxp7UFXx7uIAlFRATl39KnSCCp472nTVtxhrI"
#end

#twtr_client = Twitter::Client.new

client = Twitter::REST::Client.new do |config|
  config.consumer_key        = "YWkWeFaQRGRybI0NYNrYiw"
  config.consumer_secret     = "1X7sroA9I3rRPzBT69cnnWIhKNeBUf4bGwF8CzTE"
  config.access_token        = "15854229-iTEQDEixW4JLltrgr4EB9vYY75RNag4CsjC9er0SC"
  config.access_token_secret = "iEyRUAdxp7UFXx7uIAlFRATl39KnSCCp472nTVtxhrI"
end