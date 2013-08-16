var http = require('http');

http.globalAgent.maxSockets = 100;

exports.resources = function(rs, callback) {
	var len = rs.length;
	rs.forEach(function(r) {
		var req = http.request({
			  host: r.host,
			  port: 80,
			  path: r.path,
			  method: r.method,
			  agent: false
			}, 
			function(response) {
				r.actualStatusCode = response.statusCode;
				r.actualResponseHeaders = response.headers;
				len--;
				if(!len) {
					callback(rs);
				}
			}
		);
		req.on('error', function(e) {
			console.log('[http] problem accessing ' + r.host + r.path);
		});
		req.on('data', function() { /* /dev/null */ });
		req.end();
	});
};