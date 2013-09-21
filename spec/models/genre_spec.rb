require 'spec_helper'

describe Genre do

	let(:genre) { FactoryGirl.create(:genre) }

	it { should respond_to(:name) }
	it { should respond_to(:user) }

	it { should validate_presence_of(:name) }

end
