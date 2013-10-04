require 'spec_helper'

describe SongsController do

	let(:song) { FactoryGirl.create(:song) }
	let(:user) { FactoryGirl.create(:user) }

	before do 
		sign_in user 
		user.favorites.create(FactoryGirl.attributes_for(:song))
	end

	describe "POST #create" do
		it "should create a song" do
			expect {
				post :create, song: { title: "Song Title", artist: "Artist Name" }
			}.to change(Song, :count).by(1)
		end
	end

	describe "PATCH #dislike" do
		it "should dislike the song" do
			patch :dislike, id: song, challenge_mode_id: song.challenge_mode
			song.reload
			song.liked.should be_false
			song.liked.should_not be_nil
		end
		it "should update the favorite's rounds won count" do
			patch :dislike, id: song, challenge_mode_id: song.challenge_mode
			user.favorites.last.rounds_won.should eq(1)
		end
	end

	describe "PATCH #like" do
		it "should like the song" do
			patch :like, id: song, challenge_mode_id: song.challenge_mode
			song.reload
			song.liked.should be_true
			song.liked.should_not be_nil
		end
		it "should update the favorite's rounds won count" do
			patch :like, id: song, challenge_mode_id: song.challenge_mode
			user.favorites.last.rounds_won.should eq(1)
		end
	end
end
