class ChallengeMode < ActiveRecord::Base

	has_one :user
	has_many :songs
	has_many :suggestions, class_name: "Song"

end
