class User < ActiveRecord::Base
	# Include default devise modules. Others available are:
	# :confirmable, :lockable, :timeoutable and :omniauthable
	devise :database_authenticatable, :registerable,
	     :recoverable, :rememberable, :trackable, :validatable

	has_many :songs	    

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

	def genres=(genres)
		@genres = genres
	end

	def genres
		@genres
	end

	def add_genre(genre)
		@genres.push(genre)
	end

	def remove_genre(genre)
		@genres.delete(genre)
	end

end
