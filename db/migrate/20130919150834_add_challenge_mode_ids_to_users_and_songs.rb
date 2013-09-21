class AddChallengeModeIdsToUsersAndSongs < ActiveRecord::Migration
  def change
  	add_column :users, :challenge_mode_id, :integer
  	add_column :songs, :challenge_mode_id, :integer
  end
end
