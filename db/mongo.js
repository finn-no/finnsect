var mongoUri = process.env.MONGOLAB_URI || "mongodb://localhost/finnsect";

var collections = ["resources"]

var db = require("mongojs").connect(mongoUri, collections);

exports.resources = function(callback) {
  db.resources.find({}, function(err, cursor) {
    if (err || !cursor) {
      console.log("[db] no resources found");
    } else {
      callback(cursor)
    }
  });
};