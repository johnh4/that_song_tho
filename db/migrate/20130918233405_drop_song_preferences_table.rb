class DropSongPreferencesTable < ActiveRecord::Migration
  def change
  	drop_table :song_preferences
  end
end
