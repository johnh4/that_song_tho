class Add < ActiveRecord::Migration
  def change
  	add_column :challenge_modes, :current_challenger, :integer, default: 0
  end
end
