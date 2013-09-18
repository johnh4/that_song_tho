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
			its(:undecided_songs) { should include(song) }
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
	end

end
