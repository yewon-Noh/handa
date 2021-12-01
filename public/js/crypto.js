var crypto = require('crypto')
var key = ''
var salt = ''
var pw = '2222'

crypto.randomBytes(4, (err, buf) => {
    if (err) throw err;
    key = buf.toString('hex');

    // console.log('key: ' + key)
})
console.log('key: ' + key)

crypto.randomBytes(64, (err, buf) => {
    if (err) throw err;
    salt = buf.toString('base64');

    console.log('salt: ' + salt.toString('hex'))

    crypto.pbkdf2(pw, salt, 100, 64, 'sha512', (err, key) => {
        if (err) throw err;
        
        console.log(pw)
        console.log('pw: ' + key.toString('base64')); 
    })
});
