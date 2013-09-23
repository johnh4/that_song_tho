class RenameChallIndexToChallengeMode < ActiveRecord::Migration
  def change
  	rename_column :challenge_modes, :current_challenger, :current_challenger_index
  end
end
