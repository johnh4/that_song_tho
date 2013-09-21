require 'spec_helper'

describe "Genre Pages" do

	let!(:user) { FactoryGirl.create(:user) }

	subject { page }

	describe "Genres page" do 

		let(:all_genres) { %w[Blues Classical Dance Electronic Hip-Hop Rock] }
		before do
			signin user
			visit genres_path
		end

		it { should have_content('My Genres') }

		it { should have_content('Like a Genre') }
		it "should display all genres" do
			#all_genres = %w[Blues Classical Dance Electronic Hip-Hop/Rap Rock]
			within("ul#like-a-genre") do
				all_genres.each do |genre|
					should have_selector('li',text: genre)
				end
			end
		end
		describe "Adding Genres" do
			describe "clicking a genre" do
				before do
					click_button all_genres.first
				end
				it "should display it under my genres" do
					within("ul#my-genres") do
						should have_selector('li', text: all_genres.first)
					end
				end
			end
		end
		describe "should display the user's current genres" do
			before do
				visit genres_path
				click_button all_genres[0]
				click_button all_genres[1]
				@my_genres = user.genres
			end

			specify { @my_genres.map{ |genre| genre.name }.should include(all_genres[0], 
																		  all_genres[1]) }

			it "should display all of my genres" do
				within("#my-genres") do
					@my_genres.each do |genre|
						should have_selector('li', text: genre.name)
					end
				end
			end

			describe "Removing a Genre" do
				before do
					click_link "dislike-#{all_genres[0]}"
				end

				it "should remove them from my genres when disliked" do
					within("#my-genres") do
						should_not have_selector('li', text: all_genres[0])
					end
				end
			end
		end

	end

end