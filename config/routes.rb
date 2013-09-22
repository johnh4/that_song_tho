ThatSongTho::Application.routes.draw do

  devise_for :users

  resources :genres, only: [:create, :destroy, :index]
  resources :challenge_modes, only: [:new, :create, :show, :destroy]
  resources :songs, only: [:create, :update, :destroy]

  patch '/songs/:id/dislike', to: "songs#dislike", as: "dislike"
  patch '/songs/:id/like',    to: "songs#like",    as: "like"
  patch '/challenge_modes/:id/make_favorite', to: "challenge_modes#make_favorite", as: "make_favorite"
  patch '/songs/:id/make_favorite', to: "songs#make_favorite", as: "make_favorite_song"


  get '/about', to: "static_pages#about"
  get '/contact', to: "static_pages#contact"
  get '/help', to: "static_pages#help"

  #get '/genres', to: "songs#genres"
  #post '/genres', to: "songs#like_genre", as: "like_genre"

  root 'static_pages#home'

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end
  
  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
