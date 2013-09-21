require 'spec_helper'

describe ChallengeMode do

	let(:challenge_mode) { FactoryGirl.create(:challenge_mode, user: FactoryGirl.create(:user)) }

	subject { challenge_mode }

	it { should respond_to(:user) }
	it { should respond_to(:songs) }
	its(:user) { should be_valid }

end
