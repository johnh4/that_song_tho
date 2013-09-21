require 'spec_helper'

describe GenresController do
	let(:user) { FactoryGirl.create(:user) }
	describe "POST #create" do

		before{ sign_in user }

		context "with valid attributes" do

			it "creates a genre" do
				expect{
					post :create, genre: { name: "BestMusicEver", user_id: user.id }
				}.to change(Genre, :count).by(1)
			end
		end
		context "with invalid attributes" do
			it "does not create a genre" do
				expect{
					post :create, genre: { name: "", user_id: user.id }
				}.to_not change(Genre, :count)
			end
		end
	end
end
