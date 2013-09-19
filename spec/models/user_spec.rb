require 'spec_helper'

describe User do
	let(:user) { FactoryGirl.build(:user) }	

	subject { user }

	it { should respond_to(:name) }
	it { should respond_to(:email) }

	it { should be_instance_of(User) }
	it { should validate_presence_of(:name) }
	it { should validate_presence_of(:email) }

	it { should respond_to(:liked_songs) }
	it { should respond_to(:disliked_songs) }
	it { should respond_to(:genres) }
	it { should respond_to(:favorite) }

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
	end
	describe "after setting genres via .genres" do
		before do
			@genres = %w[Hip-Hop/Rap Country Pop R&B Rock Soul Electronic Dubstep]
			user.genres = @genres
			user.save
		end

		it "should be accessible" do
			genres = %w[Hip-Hop/Rap Country Pop R&B Rock Soul Electronic Dubstep]
			user.genres.should == genres
		end

		describe "should be able to be added to" do
			before do
				user.add_genre('Classic Rock')
			end

			its(:genres) { should include('Classic Rock') }
		end

		describe "and should be able to be subtracted from" do
			before { user.remove_genre('Dubstep') }

			its(:genres) { should_not include('Dubstep') }
		end
	end
	describe "favorites" do
		describe "are not defined by default" do
			its(:favorite) { should be_nil }
		end

		describe "can be set" do
			let!(:song) { FactoryGirl.create(:song) }
			before { user.set_favorite(song) }

			its(:favorite) { should == song }
		end
	end

end
