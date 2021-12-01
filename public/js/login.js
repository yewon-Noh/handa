const mysql = require('mysql');
const dbConfig = require('./dbConfig');
const crypto = require('crypto');

var dbOptions = {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
};
var conn = mysql.createConnection(dbOptions);
conn.connect();

function login(req, res){
    var email = req.body.email;
    var pwd = req.body.password;
    var sql = 'SELECT * FROM user WHERE email=?';
    conn.query(sql, [email], function (err, results) {
        if (err)
            console.log(err);

        if (!results[0])
            // return res.send('please check your id.');
            return res.render('login', { email:email, message_email: '이메일을 확인해주세요.' , message_pw:''})

        var user = results[0];

        sql = 'SELECT * FROM `key` WHERE `key`=?';
        conn.query(sql, [user.key], function (err, results) {
            if (err)
                console.log(err);

            var key = results[0];

            crypto.pbkdf2(pwd, key.salt, 100, 64, 'sha512', function (err, derivedKey) {
                if (err)
                    console.log(err);

                if (derivedKey.toString('base64') === user.password) {
                    req.session.name = user.name
                    req.session.save(function () {
                        return res.redirect('/app')
                    })
                    // return res.send('login success');

                }
                else {
                    // return res.send('please check your password.');
                    return res.render('login', { email:email, message_email:'', message_pw: '비밀번호를 확인해주세요.' })
                }
            });//pbkdf2
        });
    });//query
}

module.exports.login = login;