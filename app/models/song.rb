class Song < ActiveRecord::Base

	validates :title, :artist, presence: true

	belongs_to :user

end
