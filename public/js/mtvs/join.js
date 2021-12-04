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

function join(req, res){

    const name = req.body.name;
    const email = req.body.email;
    var pwd = req.body.pwd;

    // 비밀번호 암호화
    const _key = crypto.randomBytes(4).toString('hex')

    const _salt = crypto.randomBytes(64).toString('base64')

    crypto.pbkdf2(pwd, _salt, 100, 64, 'sha512', (err, key) => {
        if (err) throw err;

        var pw_e = key.toString('base64')

        //데베 insert
        var sql_key = 'INSERT INTO `key` VALUES(?, ?)';
        conn.query(sql_key, [_key, _salt], function (err, results) {

            if (err)
                console.log(err);

            var sql_user = 'INSERT INTO `user` VALUES(?, ?, ?, ?)';
            conn.query(sql_user, [email, name, pw_e, _key], function (err, results) {
                if (err){
                    console.log(err);
                    return res.send("-1");
                }    

                return res.send("1");

            });//query
        });//query
    })
}

function emailCheck(req, res){
    var email = req.body.email;
    var sql = 'SELECT * FROM user WHERE email=?';
    conn.query(sql, [email], function (err, results) {
        if (err){
            console.log(err);
            return res.send("1");
        }

        if (!results[0]){
            return res.send("1");
        }

        return res.send("-1");
    });//query
}

module.exports.join = join;
module.exports.emailCheck = emailCheck;