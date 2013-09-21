class Song < ActiveRecord::Base

	validates :title, :artist, presence: true

	belongs_to :user
	belongs_to :challenge_mode

end
