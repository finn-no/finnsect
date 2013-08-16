var db 		= require('../db/mongo');
var httpr = require('../httpr');

exports.resources = function(req, res) {
	db.resources(function(rs) { 
		httpr.resources(rs, function(data) {
			res.render('resources', {
				title: 'resources', 
				resources: data.map(function(r) {
					r.ok = r.statusCode == r.actualStatusCode
					return r;
				})
			});
		});
	});
}