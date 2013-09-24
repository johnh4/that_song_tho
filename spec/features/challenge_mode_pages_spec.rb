require 'spec_helper'

describe "Challenge Mode Pages" do

	let(:user) { FactoryGirl.create(:user) }
	#let(:challenge_mode) { FactoryGirl.create(:challenge_mode) }
	before { signin user }

	subject { page }

	describe "New Challenge Page" do
		before { visit new_challenge_mode_path }

		it { should have_content('New Challenge') }
		it { should have_button('Start') }

		describe "Starting Challenge Mode" do
			before { click_button 'Start' }

			it { should have_content('Challenger') }
		end
	end

	describe "Show Challenge Page" do
		before do
			visit new_challenge_mode_path
			click_button 'Start'
		end
		xit "should have dislike button" do
			within('.challenger-forms') do
				should have_button('dislike')
			end
		end
		context "challenger forms" do
			context "dislike forms" do
				it { should have_button('dislike') }

				describe "after clicking dislike" do

					before do
						within('#current-challenger-forms') do
							click_button('dislike')
						end
					end

					it "should change user's dislike count" do
						user.disliked_songs.should_not be_empty
						user.liked_songs.should be_empty
					end

					xit "should not be able to be added more than once" do
						within('#current-challenger-forms') do
							click_button('dislike')
						end
					end
				end
				it "should update the favorite's rounds_won count" do
					within('#current-challenger-forms') do
						click_button('dislike')
						user.favorites.last.rounds_won.should == 1
					end					
				end
			end
			context "like forms" do
				it { should have_button('like') }

				it "should change user's like count" do
					within('#current-challenger-forms') do
						click_button('like')
						user.liked_songs.should_not be_empty
						user.disliked_songs.should be_empty
					end
				end
				it "should update the favorite's rounds_won count" do
					within('#current-challenger-forms') do
						click_button('like')
						user.favorites.last.rounds_won.should == 1
					end
				end
				describe "a favorite's rounds won count is correct after 2 likes" do
					before do
						within('#current-challenger-forms') do
							click_button 'like'
							click_button 'like'
						end
					end

					specify { user.favorites.last.rounds_won.should == 2 }
				end
			end
			context "favorite forms" do
				specify "challenger should have make favorite button" do
					within('#current-challenger-forms') do
						have_button('make favorite')
					end
				end
				it "should change the favorite" do
					expect{
						click_button('make favorite')
					}.to change(user.favorites, :count)
				end
				it "should have the correct rounds won for the favorite" do
					within('#rounds-won') do
						should have_content(user.favorites.last.rounds_won)
					end
				end
			end
		end
	end

end