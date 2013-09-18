class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :title
      t.string :artist
      t.string :album
      t.string :length
      t.string :genre
      t.string :user_id

      t.timestamps
    end
  end
end
