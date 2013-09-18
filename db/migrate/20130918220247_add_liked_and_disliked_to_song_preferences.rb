class AddLikedAndDislikedToSongPreferences < ActiveRecord::Migration
  def change
  	add_column :song_preferences, :liked_id, :integer
  	add_column :song_preferences, :disliked_id, :integer
  end
end
