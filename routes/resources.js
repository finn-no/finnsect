var db    = require('../db/mongo');
var httpr = require('../httpr');

exports.get = function(req, res) {
  db.getResources(function(rs) { 
    httpr.resources(rs, function(data) {
      res.render('resources', {
        title: 'resources', 
        resources: data.map(function(r) {
          r.status = {};
          r.status.statusCode = r.statusCode == r.actualStatusCode;
          r.status.headers    = r.status.statusCode && isSubset(r.responseHeaders, r.actualResponseHeaders)
          r.status.partial    = !r.status.headers ^ !r.status.statusCode;
          r.status.success    = r.status.statusCode && r.status.headers;
          r.actualResponseHeaders = toArray(r.actualResponseHeaders);
          return r;
        })
      });
    });
  });
}

var validIp = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$";

var validHostname = "^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$";

exports.post = function(req, res) {
  console.log(req.body)
  var resource = {};
  var errorFields = [];
  if (req.body.inputHost && 
    (req.body.inputHost.match(validIp) || req.body.inputHost.match(validHostname))) {
    resource.host = req.body.inputHost;
  } else {
    errorFields.push("host")
  }
  if (req.body.inputPath) { 
   resource.path = req.body.inputPath;
  } else {
    errorFields.push("path");
  }
  if (req.body.selectMethod) {
    resource.method = req.body.selectMethod;
  } else {
    errorFields.push("method");
  }
  if (req.body.inputStatusCode) {
    resource.statusCode = req.body.inputStatusCode;
  } else {
    errorFields.push("status code");
  }
  if (req.body.textRequestHeaders) {
    resource.requestHeaders = splitHeaders(req.body.textRequestHeaders);
  } else {
    errorFields.push("request headers");
  }
  if (req.body.textResponseHeaders) {
    resource.responseHeaders = splitHeaders(req.body.textResponseHeaders);
  } else {    
    errorFields.push("response headers");
  }
  if (errorFields.length > 0) {
    badRequest(res, errorFields);
  } else {
    db.addResource(resource, function(r) {
      res.writeHead(302, {'Location': 'resources'});
      res.end();
    });
  }
}

function badRequest(res, fields) {
  res.statusCode = 400;
  res.setHeader("Content-Type", "text/plain");
  res.write("erroneous fields: " + fields);
  res.end();
}

function splitHeaders(data) {
  function splitHeader(header) {
    var split = header.split(":");
    return {
      name: split[0].trim(),
      value: split[1].trim()
    };
  }
  return data.trim().split("\r\n").map(splitHeader);
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