var db = require('../db/mongo')

exports.resources = function(req, res) {
	db.resources(function(rs) { 
			res.render('resources', {
			title: 'resources', 
			resources: rs
		});
	});
}