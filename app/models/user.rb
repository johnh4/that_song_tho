class User < ActiveRecord::Base
	# Include default devise modules. Others available are:
	# :confirmable, :lockable, :timeoutable and :omniauthable
	devise :database_authenticatable, :registerable,
	     :recoverable, :rememberable, :trackable, :validatable

	validates :name, presence: true
	
	def liked_songs
		Song.where(liked: true)
	end

	def disliked_songs
		Song.where(liked: false)
	end

	def undecided_songs
		Song.where(liked: nil)
	end
end
