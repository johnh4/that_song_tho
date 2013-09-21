class GenresController < ApplicationController

	def new
	end

	def index
		@genres = current_user.genres
		@all_genres = %w[Blues Classical Dance Electronic Hip-Hop Rock]
	end

	def create
		@genre = current_user.genres.build(genre_params)
		if @genre.save
			flash[:success] = "Genre added!"
			redirect_to genres_path
		else
			render 'index'
		end
	end

	def destroy
		@genre = Genre.find_by(name: params[:id])
		@genre.destroy
		flash[:notice] = "Genre removed!"
		redirect_to genres_path
	end


	private

		def genre_params
			params.require(:genre).permit(:name)
		end

end
