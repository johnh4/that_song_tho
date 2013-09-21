class ChallengeMode < ActiveRecord::Base
	has_one :user
	has_many :songs


end
