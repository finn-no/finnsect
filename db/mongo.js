var mongoUri = process.env.MONGOLAB_URI || "mongodb://localhost/finnsect";

var collections = ["resources"]

var db = require("mongojs").connect(mongoUri, collections);

exports.getResources = function(callback) {
  db.resources.find({}, function(err, cursor) {
    if (err || !cursor) {
      console.log("[db] no resources found");
    } else {
      var resources = cursor.map(function(c) {
        return {
          "id": c._id,
          "host": c.host,
          "path": c.path,
          "method": c.method,
          "requestHeaders": c.requestHeaders,
          "responseHeaders": c.responseHeaders,
          "statusCode": c.statusCode
        }        
      });
      callback(resources);
    }
  });
};

exports.addResource = function(resource, callback) {
  var dbObject = {
    "host": resource.host,
    "path": resource.path,
    "method": resource.method,
    "requestHeaders": resource.requestHeaders,
    "responseHeaders": resource.responseHeaders,
    "statusCode": resource.statusCode
  }
  db.resources.save(dbObject, function(err, saved) {
    if (err || !saved) {
      console.log("[db] resource not saved");
    } else {
      callback(saved);
    }
  });
}