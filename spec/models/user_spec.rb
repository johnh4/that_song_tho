require 'spec_helper'

describe User do
	let(:user) { FactoryGirl.build(:user) }	

	subject { user }

	it { should respond_to(:name) }
	it { should respond_to(:email) }
	it { should respond_to(:challenge_mode_id) }

	it { should be_instance_of(User) }
	#it { should validate_presence_of(:name) }
	it { should validate_presence_of(:email) }

	it { should respond_to(:liked_songs) }
	it { should respond_to(:disliked_songs) }
	it { should respond_to(:genres) }
	it { should respond_to(:favorites) }
	it { should respond_to(:suggestions) }

	describe "when email address is not valid" do
		it "should not be valid" do
			addresses = %w[blah blahatfake.com f@. testing@com]
			addresses.each do |address|
				user.email = address
				expect(user).to_not be_valid
			end
		end
	end
	describe "song associations" do
		let(:song) { FactoryGirl.create(:song, user_id: user.id) }
		before { user.save }

		context "songs neither liked nor disliked" do
			its(:liked_songs) { should be_empty }
			its(:disliked_songs) { should be_empty }
			its(:undecided_songs) { should include(song) }

			describe "can be liked using user method" do
				before { user.like_song(song) }
				specify { song.liked.should be_true }
			end
			describe "can be disliked using user method" do
				before { user.dislike_song(song) }
				specify { song.liked.should be_false }
			end
		end

		context "liked songs" do
			let!(:liked_song) { FactoryGirl.create(:song, liked: true, user_id: user.id) }
			specify { user.liked_songs.should_not be_empty }
			its(:liked_songs) { should include(liked_song) }
		end

		context "disliked songs " do
			let!(:disliked_song) { FactoryGirl.create(:song, liked: false, user_id: user.id) }
			its(:disliked_songs) { should include(disliked_song) }
		end

		describe "when another user likes" do
			let(:user_2) { FactoryGirl.create(:user) }
			let!(:song_2) { FactoryGirl.create(:song, user_id: user_2.id, liked: true) }

			specify{ user_2.liked_songs.should_not be_empty }

			its(:liked_songs) { should be_empty }
		end
		describe "should not affect favorites" do
			before do
				@liked = user.liked_songs.create(title: "not a fav", artist: "some dude")
				@fav = user.favorites.create(favoriter_id: user.id, title: "faved it", artist: "fav gal")
			end
			its(:liked_songs) { should include(@liked) }
			its(:favorites) { should include(@fav) }
			its(:favorites) { should_not include(@liked) }
		end
	end
	describe "after setting genres via association" do
		before { user.save }
		let!(:opera) { FactoryGirl.create(:genre, user: user, name: "Opera") }
		let!(:rap) { FactoryGirl.create(:genre, user: user, name: "Rap") }

		let!(:rock) { FactoryGirl.create(:genre, user: FactoryGirl.create(:user), name: "Rock") }

		it "should be accessible via association" do
			user.genres.should include(opera, rap)
		end
		its(:genres) { should_not include(rock) }

		describe "should be able to be added to" do
			before do
				@showtunes = user.genres.create(name: "Showtunes")
			end

			its(:genres) { should include(@showtunes) }
		end

		describe "and should be able to be subtracted from" do
			before { user.genres.find_by(name: "Opera").destroy }

			its(:genres) { should_not be_empty }
			its(:genres) { should_not include(opera) }
		end
	end
	describe "favorites" do
		before { user.save }
		describe "are empty by default" do
			its(:favorites) { should be_empty }
		end

		describe "can be set" do
			before { @my_fav = user.favorites.create(FactoryGirl.attributes_for(:song)) }

			specify { user.favorites.last.should == @my_fav }
			specify { user.favorites.last.should be_instance_of(Song) }

			describe "and subsequent favorites can be set" do
				before { @my_new_fav = user.favorites.create(FactoryGirl.attributes_for(:song)) }

				specify { user.favorites.last.should == @my_new_fav }
			end
		end
	end
	describe "suggestions" do
		describe "are not defined by default" do
			its(:suggestions) { should be_empty }
		end

		describe "can have songs added" do
			before do
				user.save
				@suggestion_1 = user.suggestions.create(FactoryGirl.attributes_for(:song))
			end

			specify { user.suggestions.first.should == @suggestion_1 }
			specify { user.suggestions.first.should be_instance_of(Song) }

			describe "and there can more than one suggesion" do
				before { @my_new_suggestion = 
						 user.suggestions.create(FactoryGirl.attributes_for(:song)) }

				specify { user.suggestions.last.should == @my_new_suggestion }
				its(:suggestions) { should include(@suggestion_1) }
			end
		end
	end
end
