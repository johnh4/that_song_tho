class ChallengeModesController < ApplicationController
  def new
  	@challenge_mode = ChallengeMode.new
  	#unless current_user.favorite.nil?
	#  	@favorite = current_user.favorite
	#else
	#end
    if current_user.favorites.empty?
      current_user.favorites.create(title: "My Fav Song", artist: "My Fav Artist")
    end
  end

  def create
  	@challenge_mode = ChallengeMode.new
  	songs_to_suggest = []
  	#replace this with songs from API suggestions
  	5.times do |n|
  		song = Song.create(title: "Song_#{n}", artist: "Artist_#{n}")
  		songs_to_suggest.push(song)
  	end
  	#feed API suggestions into this
  	if @challenge_mode.save
	  	songs_to_suggest.each do |song|
	  		@challenge_mode.suggestions.create!(title: song.title, artist: song.artist)
	  	end
  		flash[:success] = "Challenge Mode has started!"
  		redirect_to @challenge_mode
  	else
  		flash.now[:error] = "Error starting challenge mode."
  		render 'new'
  	end
  end

  def show
  	@challenge_mode = ChallengeMode.find(params[:id])
    #current_user.reload
    #if current_user.favorite.nil?
    #	current_user.create_favorite(title: "My Fav Song", artist: "My Fav Artist")
    #end
    @suggestions = @challenge_mode.suggestions
    @current_challenger = @suggestions[4]
  	if current_user.favorites.empty?
      #@favorite = current_user.favorite
  	else
      #current_user.reload
      @favorite = current_user.favorites.last
  	end
  end

  def make_favorite
    @new_favorite = Song.find(params[:id])
      @challenge_mode = @new_favorite.challenge_mode

      current_user.favorites.create(title: @new_favorite.title, artist: @new_favorite.artist)
      flash[:notice] = "Your last new favorites song is 
                #{@new_favorite.title} by #{@new_favorite.artist}.
                current_user.favorites.last.title is #{current_user.favorites.last.title}.
                "
      redirect_to @challenge_mode
  end

  def destroy
  end


  	private

  		def challenge_mode_params
  			params.require(:challenge_mode)
  		end
end
