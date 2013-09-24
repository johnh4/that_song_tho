class AddRoundsWonToSongs < ActiveRecord::Migration
  def change
  	add_column :songs, :rounds_won, :integer, default: 0
  end
end
