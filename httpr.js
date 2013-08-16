var http = request('http');

function request(methodf, options, callback) {
	methodf(options, function(resp) {
		callback(resp.statusCode);
	}); 
};

var get = function(options, callback) {
	request(http.get, options, callback);
};

var post = function(options, callback) {
	request(http.post, options, callback);
};

var put = function(options, callback) {
	request(http.put, options, callback);
};

var head = function(options, callback) {
	request(http.head, options, callback);
};