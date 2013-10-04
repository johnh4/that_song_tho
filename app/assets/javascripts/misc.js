$(document).ready(function(){
	function ajaxTest(){
		$.ajax({
			url: '/challenge_modes/9',
			//url: '/partial',
			method: 'GET',
			contentType: 'application/json',
			success: function(response){
				$('#test').html(response);
				console.log('response from misc ajax: ' + response);
				console.log('response.second_element: ' + response.second_element);
				console.log('response.html: ' + response.html);
			}
		});
	}

	//ajaxTest();
});