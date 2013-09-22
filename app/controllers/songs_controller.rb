class SongsController < ApplicationController
	def update
		@song = Song.find(params[:id])
		if @song.update(song_params)
			flash[:success] = "Song updated"
			redirect_to root_path
		else
			flash[:error] = "Song not updated."
			redirect_to root_path
		end
	end

	def dislike
		@song = Song.find(params[:id])
		@challenge_mode = @song.challenge_mode
		@song.update(liked: false)
		if current_user.songs.find_by(title: @song.title, artist: @song.artist)
			matches = current_user.songs.where(title: @song.title, artist: @song.artist)
			matches.each { |match| match.update(liked: false) }
		else
			current_user.songs.create(title: @song.title, artist: @song.artist, liked: false)
		end
		redirect_to @challenge_mode
	end

	def like
		@song = Song.find(params[:id])
		@challenge_mode = @song.challenge_mode
		@song.update(liked: true)
		if current_user.songs.find_by(title: @song.title, artist: @song.artist)
			matches = current_user.songs.where(title: @song.title, artist: @song.artist)
			matches.each { |match| match.update(liked: true) }
		else
			current_user.songs.create(title: @song.title, artist: @song.artist, liked: true)
		end
		redirect_to @challenge_mode
	end

	def make_favorite
	    @new_favorite = Song.find(params[:id])
	    @challenge_mode = @new_favorite.challenge_mode

	    current_user.favorites.create(title: @new_favorite.title, artist: @new_favorite.artist)
	    flash[:notice] = "From songs controller. Your last new favorites song is 
	    					#{@new_favorite.title} by #{@new_favorite.artist}.
	    					current_user.favorites.last.title is #{current_user.favorites.last.title}.
	    					"
	    redirect_to @challenge_mode
	  end


	private

		def song_params
			params.require(:song).permit(:liked)
		end
end
