class Song < ActiveRecord::Base

	validates :title, :artist, presence: true
	#default_scope -> { order('created_at ASC') }

	belongs_to :user
	belongs_to :challenge_mode

end
