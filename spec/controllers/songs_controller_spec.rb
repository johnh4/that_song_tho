require 'spec_helper'

describe SongsController do

	let(:song) { FactoryGirl.create(:song) }
	let(:user) { FactoryGirl.create(:user) }

	before { sign_in user }

	describe "PATCH #dislike" do
		it "should dislike the song" do
			patch :dislike, id: song, challenge_mode_id: song.challenge_mode
			song.reload
			song.liked.should be_false
			song.liked.should_not be_nil
		end
	end

	describe "PATCH #like" do
		it "should like the song" do
			patch :like, id: song, challenge_mode_id: song.challenge_mode
			song.reload
			song.liked.should be_true
			song.liked.should_not be_nil
		end
	end
end
