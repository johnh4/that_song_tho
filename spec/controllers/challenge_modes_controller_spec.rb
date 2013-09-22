require 'spec_helper'

describe ChallengeModesController do

  let(:user) { FactoryGirl.create(:user) }
  before { sign_in user }

  describe "GET 'new'" do
    it "returns http success" do
      get 'new'
      response.should be_success
    end
  end

  describe "GET 'show'" do
    before{ user.favorites.create(FactoryGirl.attributes_for(:song)) }

    it "returns http success" do
      get 'show', id: 1
      response.should be_success
    end
    xit "has the correct favorite" do
      get 'show', id: 1
      favorite = user.favorite
      assigns(:favorite).should eq(favorite)
    end
  end

  describe "POST #create" do
    context "with valid attributes" do
      it "should create a challenge mode object" do
        expect{
          post :create
        }.to change(ChallengeMode, :count).by(1)
      end
    end
  end

  describe "PATCH #make_favorite" do
    let(:new_fav) { FactoryGirl.create(:song, title: "My New Favorite Song") }
    it "should make a song a favorite" do
      patch :make_favorite, id: new_fav
      #user.reload
      user.favorites.last.title.should == "My New Favorite Song"
    end
  end

end
