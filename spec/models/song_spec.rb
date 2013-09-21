require 'spec_helper'

describe Song do
	let!(:user_a) { FactoryGirl.create(:user) }
	let(:user_song) { FactoryGirl.create(:song, user_id: user_a.id) }
	let!(:song) { FactoryGirl.create(:song) }

	subject { song }

	it { should respond_to(:title) }
	it { should respond_to(:album) }
	it { should respond_to(:artist) }
	it { should respond_to(:genre) }
	it { should respond_to(:length) }
	it { should respond_to(:user_id) }
	it { should respond_to(:liked) }
	it { should respond_to(:challenge_mode_id) }

	describe "title" do
		context "when empty" do
			before { song.title = "" }

			it { should_not be_valid }
		end
	end

	describe "liking" do
		context "by default" do
			its(:liked) { should be_nil }
		end
		describe "after liked" do
			before { song.liked = true }
			its(:liked) { should eq(true) }

			specify { user_song.liked.should_not eq(true) }
		end
		describe "after disliked" do
			before { song.liked = false }
			its(:liked) { should == false }
		end
	end

end
