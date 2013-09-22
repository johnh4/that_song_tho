class User < ActiveRecord::Base
	# Include default devise modules. Others available are:
	# :confirmable, :lockable, :timeoutable and :omniauthable
	devise :database_authenticatable, :registerable,
	     :recoverable, :rememberable, :trackable, :validatable

	has_many :songs
	has_many :genres
	belongs_to :challenge_mode 

	#has_one :favorite, class_name: "Song"
	has_many :favorites, class_name: "Song"
	has_many :suggestions, class_name: "Song"  

	validates :name, presence: true
	
	def liked_songs
		songs.where(liked: true)
	end

	def disliked_songs
		songs.where(liked: false)
	end

	def undecided_songs
		songs.where(liked: nil)
	end

	def like_song(song)
		song.liked = true
	end

	def dislike_song(song)
		song.liked = false
	end

	def favorite
		favorites.last
	end
end
