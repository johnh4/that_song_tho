class User < ActiveRecord::Base
	# Include default devise modules. Others available are:
	# :confirmable, :lockable, :timeoutable and :omniauthable
	devise :database_authenticatable, :registerable,
	     :recoverable, :rememberable, :trackable, :validatable

	has_many :songs
	has_many :genres
	belongs_to :challenge_mode    

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
=begin
	def genres=(genres)
		@genres = genres
	end

	def genres
		@genres.nil? ? [] : @genres
	end

	def add_genre(genre)
		@genres.nil? ? @genres=[genre] : @genres.push(genre)
	end

	def remove_genre(genre)
		@genres.delete(genre)
	end
=end
	def favorite=(song)
		@favorite = song
	end

	def set_favorite(song)
		@favorite = song
	end

	def favorite
		@favorite
	end

end
