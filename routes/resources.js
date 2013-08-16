var db    = require('../db/mongo');
var httpr = require('../httpr');

exports.resources = function(req, res) {
  db.resources(function(rs) { 
    httpr.resources(rs, function(data) {
      var id = 0;
      res.render('resources', {
        title: 'resources', 
        resources: data.map(function(r) {
          r.id = id ++;
          r.status = {};
          r.status.statusCode = r.statusCode == r.actualStatusCode;
          r.status.headers    = isSubset(r.responseHeaders, r.actualResponseHeaders);
          r.status.partial    = !r.status.headers ^ !r.status.statusCode;
          r.status.success    = r.status.statusCode && r.status.headers;
          r.actualResponseHeaders = toArray(r.actualResponseHeaders);
          return r;
        })
      });
    });
  });
}

function isSubset(array, obj) {
  var common = 0;
  array.forEach(function(a) {
    var hdr = obj[a.name]
    if (hdr && hdr.indexOf(a.value) != -1) {
      common ++
    }
  });
  return common == array.length
}

function toArray(obj) { 
  var acc = [];
  for (var keys in obj) {
    acc.push({"name" : keys, "value" : obj[keys]});
  };
  return acc;
}