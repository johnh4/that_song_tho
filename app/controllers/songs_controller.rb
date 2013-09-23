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

		#move to the next challenger
		num_sugg = @challenge_mode.suggestions.count
		last_chall = @challenge_mode.current_challenger_index
		if last_chall < num_sugg - 1
			current_challenger_index = last_chall + 1
		else
			current_challenger_index = 0
		end
		@challenge_mode.update(current_challenger_index: current_challenger_index)
		@current_challenger = @challenge_mode.suggestions[current_challenger_index]

		#dislike the song, remove duplicates
		@song.update(liked: false)
		if current_user.songs.find_by(title: @song.title, artist: @song.artist)
			matches = current_user.songs.where(title: @song.title, artist: @song.artist)
			matches.each do |match| 
				match.destroy
			end
			current_user.songs.create(title: @song.title, artist: @song.artist, liked: false)
		else
			current_user.songs.create(title: @song.title, artist: @song.artist, liked: false)
		end

		respond_to do |format|
			format.html { redirect_to @challenge_mode }
			format.js
		end
	end

	def like
		@song = Song.find(params[:id])
		@challenge_mode = @song.challenge_mode

		#move to the next challenger
		num_sugg = @challenge_mode.suggestions.count
		last_chall = @challenge_mode.current_challenger_index
		if last_chall < num_sugg - 1
			current_challenger_index = last_chall + 1
		else
			current_challenger_index = 0
		end
		@challenge_mode.update(current_challenger_index: current_challenger_index)
		@current_challenger = @challenge_mode.suggestions[current_challenger_index]

		#like the song, remove duplicates
		@song.update(liked: true)
		if current_user.songs.find_by(title: @song.title, artist: @song.artist)
			matches = current_user.songs.where(title: @song.title, artist: @song.artist)
			matches.each do |match| 
				match.destroy
			end
			current_user.songs.create(title: @song.title, artist: @song.artist, liked: true)
		else
			current_user.songs.create(title: @song.title, artist: @song.artist, liked: true)
		end

		respond_to do |format|
			format.html { redirect_to @challenge_mode }
			format.js
		end
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
