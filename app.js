var express   = require('express')
  , routes    = require('./routes')
  , index     = require('./routes/index')
  , resources = require('./routes/resources')
  , http      = require('http')
  , path      = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'mmm');
  app.set('layout', 'layout');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('lalashere'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({src: __dirname + '/public', compress: true}));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
  app.enable('view cache');
});

app.get('/', routes.index);
app.get('/resources', resources.get);
app.post('/resources', resources.post);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});