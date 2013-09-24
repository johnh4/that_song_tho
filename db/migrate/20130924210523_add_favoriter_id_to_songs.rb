class AddFavoriterIdToSongs < ActiveRecord::Migration
  def change
  	add_column :songs, :favoriter_id, :integer
  end
end
