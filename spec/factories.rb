FactoryGirl.define do
	factory :user do
		sequence(:name)		{ |n| "User-#{n}" }
		sequence(:email)	{ |n| "user#{n}@example.com" }
		password	"password"
		password_confirmation	"password"
	end

	factory :song do
		title	"FuckWithMeYouKnowIGotIt"
		album	"Magna Carta: Holy Grail"
		artist	"Jay-Z"
		length	"4:03"
		genre	"Hip-Hop/Rap"
		liked	nil
		user

		factory :liked do
			title  "I like this song"
			album  "You like this album"
			artist "Likeable Guy"
			length "3:00"
			genre  "Pop"
			liked true
		end

		factory :disliked do
			title  "I dislike this song"
			album  "You dislike this album"
			artist "Dislikeable Guy"
			length "6:00"
			genre  "Unpop"
			liked false
		end
	end
end