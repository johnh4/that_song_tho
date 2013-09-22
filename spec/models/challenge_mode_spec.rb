require 'spec_helper'

describe ChallengeMode do

	let(:challenge_mode) { FactoryGirl.create(:challenge_mode, user: FactoryGirl.create(:user)) }

	subject { challenge_mode }

	it { should respond_to(:user) }
	it { should respond_to(:songs) }
	its(:user) { should be_valid }
	it { should respond_to(:suggestions) }

	describe "suggestions" do
		describe "are not defined by default" do
			its(:suggestions) { should be_empty }
		end

		describe "can have songs added" do
			before do
				@suggestion_1 = 
							challenge_mode.suggestions.create(FactoryGirl.attributes_for(:song))
			end

			specify { challenge_mode.suggestions.first.should == @suggestion_1 }
			specify { challenge_mode.suggestions.first.should be_instance_of(Song) }

			describe "and there can more than one suggesion" do
				before { @my_new_suggestion = 
						 challenge_mode.suggestions.create(FactoryGirl.attributes_for(:song)) }

				specify { challenge_mode.suggestions.last.should == @my_new_suggestion }
				its(:suggestions) { should include(@suggestion_1) }
			end
		end
	end
end
