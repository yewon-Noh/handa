// login + join + idPw 에 관한 모듈
require("dotenv").config();

const conn = require('./dbConfig');
const crypto = require('crypto');
const key = 'HAnDaStArt2021$!';

// 비밀번호 암호화 - sha256
function hash(password) {
    return crypto.createHmac('sha256', process.env.SECRET_KEY).update(password).digest('hex');
}

// 이메일 중복확인
function emailCheck(req, res){
    var email = req.body.email;
    var sql = 'SELECT * FROM user WHERE u_email=?';
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

// 회원가입
function join(req, res){

    const name = req.body.name;
    const email = req.body.email;
    const pwd = req.body.pwd;
    const tel = req.body.tel;
    const job = req.body.job;

    // 비밀번호 암호화
    const password = hash(pwd);

    // insert
    var sql_user = 'INSERT INTO `user` VALUES(?, ?, ?, ?, ?)';
    conn.query(sql_user, [email, password, name, tel, job], function (err, results) {
        if (err){
            console.log(err);
            return res.send("-1");
        }    

         return res.send("1");

    });//query
  };

// 로그인
function login(req, res){
    var email = req.body.email;
    var pwd = req.body.password;

    // 해당 이메일 유저가 있는지 먼저 확인
    var sql = 'SELECT * FROM user WHERE u_email=?';
    conn.query(sql, [email], function (err, results) {
        if (err)
            console.log(err);

        if (!results[0])
            // return res.send('please check your id.');
            return res.render('login', { email:email, message_email: '이메일을 확인해주세요.' , message_pw:''})

        // 입력받은 비밀번호 암호하
        var password = hash(pwd);

        // 정보가 잇는지 확인
        sql = 'SELECT * FROM user WHERE u_email=? and u_password=?';
        conn.query(sql, [email, password], function (err, results) {
            if (err)
                console.log(err);

            if (!results[0])
                return res.render('login', { email:email, message_email:'', message_pw: '비밀번호를 확인해주세요.' })
            
            return res.redirect('/')

        });
    });//query
}

module.exports.hash = hash
module.exports.emailCheck = emailCheck
module.exports.join = join
module.exports.login = login