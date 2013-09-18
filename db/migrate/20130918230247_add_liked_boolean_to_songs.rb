class AddLikedBooleanToSongs < ActiveRecord::Migration
  def change
  	add_column :songs, :liked, :boolean, default: nil
  end
end
