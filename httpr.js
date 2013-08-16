var http = require('http');

exports.resources = function(rs, callback) {
	var len = rs.length;
	rs.forEach(function(r) {
		var req = http.request(
			{
			  host: r.host,
			  port: 80,
			  path: r.path,
			  method: r.method
			}, 
			function(response) {
				r.actualStatusCode = response.statusCode;
				len--;
				if(!len) {
					callback(rs);
				}
			}
		);
		req.on('error', function(e) {
			console.log('[http] problem accessing ' + r.host + r.path);
		});
		req.end();
	});
};