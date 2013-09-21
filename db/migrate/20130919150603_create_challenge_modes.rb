class CreateChallengeModes < ActiveRecord::Migration
  def change
    create_table :challenge_modes do |t|

      t.timestamps
    end
  end
end
