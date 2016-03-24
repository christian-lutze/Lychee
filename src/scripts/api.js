/**
 * @description This module communicates with Lychee's API
 * @copyright   2015 by Tobias Reich
 */

api = {

	path    : 'php/index.php',
	onError : null

}

api.post = function(fn, params, callback) {

	loadingBar.show()

	params = $.extend({ function: fn }, params)

	const success = (data) => {

		setTimeout(loadingBar.hide, 100)

		// Catch errors
		if (typeof data==='string' && data.substring(0, 7)==='Error: ') {
			api.onError(data.substring(7, data.length), params, data)
			return false
		}

		// Convert true and false to real booleans
		if (data==='true')       data = true
		else if (data==='false') data = false

		// Convert to JSON if string start with '{' and ends with '}'
		if (typeof data==='string' && data.substring(0, 1)==='{' && data.substring(data.length - 1, data.length)==='}') {
			data = $.parseJSON(data)
		}

		callback(data)

	}

	const error = (jqXHR, textStatus, errorThrown) => {

		api.onError('Server error or API not found.', params, errorThrown)

	}

	$.ajax({
		type: 'POST',
		url: api.path,
		data: params,
		dataType: 'text',
		success,
		error
	})

}