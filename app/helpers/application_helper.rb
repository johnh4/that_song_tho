module ApplicationHelper
	def store_location
		session[:return_to] = request.url
	end

	def redirect_back_or(default)
		redirect_to(session[:return_to] || default)
		cookies.delete(:return_to)
	end
end
