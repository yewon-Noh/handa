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
    var sql_user = 'INSERT INTO `user` VALUES(?, ?, ?, ?, ?, NOW())';
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

        // 정보가 있는지 확인
        sql = 'SELECT * FROM user WHERE u_email=? and u_password=?';
        conn.query(sql, [email, password], function (err, results) {
            if (err)
                console.log(err);

            if (!results[0])
                return res.render('login', { email:email, message_email:'', message_pw: '비밀번호를 확인해주세요.' });
            
            req.session.is_logined = true;
            req.session.email = results[0].u_email;
            req.session.save(err => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("<h1>500 error</h1>");
                }
                return res.redirect('/');
            });
            // return res.redirect('/')

        });
    });//query
}

// 이메일 찾기
function emailSearch(req, res){
    var name = req.body.name;
    var tel = req.body.tel;

    // 이메일 찾기
    var sql = 'SELECT u_email FROM user WHERE u_name=? and u_tel=?';

    conn.query(sql, [name, tel], function (err, results) {
        if (err)
            console.log(err);

        if (!results[0])
            return res.send({result: false, msg:"이메일이 존재하지 않습니다."})
        
        var email = results[0].u_email;
        return res.send({result: true, msg:name + " 님의 이메일은 " + email + " 입니다."})

    });
}

// 비밀번호 찾기
function pwdSearch(req, res){
    var name = req.body.name;
    var email = req.body.email;

    // 이메일 찾기
    var sql = 'SELECT * FROM user WHERE u_name=? and u_email=?';

    conn.query(sql, [name, email], function (err, results) {
        if (err)
            console.log(err);

        if (!results[0])
            return res.send({result: false, msg:"이메일이 존재하지 않습니다."})
        
        // var email = results[0].u_email;
        return res.send({result: true, msg:""})

    });
}

// 비밀번호 재설정
function setPw(req, res){

    const email = req.body.email;
    const pwd = req.body.pwd;

    // 비밀번호 암호화
    const password = hash(pwd);

    // update
    var sql_user = 'UPDATE `user` SET u_password=? WHERE u_email=?';
    conn.query(sql_user, [password, email], function (err, results) {
        if (err){
            console.log(err);
            return res.send({result:false, msg:"비밀번호 변경에 실패하였습니다."});
        }    

         return res.send({result:true, msg:"비밀번호가 변경되었습니다."});

    });//query
  };

  //mypage
  function mypage(req,res) {
      var email = req.session.email

    var sql = 'SELECT * FROM user WHERE u_email=?';
    conn.query(sql, [email], function (err, results) {
        if (err) {
            console.log(err);
            res.render('mypage', {logined:"true", email:req.session.email, users:"", questions:"", comments:""})
        }

        if (!results[0])
        res.render('mypage', {logined:"true", email:req.session.email, users:"", questions:"", comments:""})

        console.log(results[0])

        var sql2 = 'SELECT q_id, ct_name, h_name FROM question q, category c, hashtag h WHERE q.ct_id = c.ct_id and q.h_id = h.h_id and u_email=?';
        conn.query(sql2, [email], function (err, results2) {
            if (err) {
                console.log(err);
                res.render('mypage', {logined:"true", email:req.session.email, users:results, questions:"", comments:""}) 
            }

            if (!results2[0])
                res.render('mypage', {logined:"true", email:req.session.email, users:results, questions:"", comments:""}) 

            

            var sql3 = 'SELECT * FROM comment WHERE u_email=?';
            conn.query(sql3, [email], function (err, results3) {
            if (err) {
                console.log(err);
                res.render('mypage', {logined:"true", email:req.session.email, users:results, questions:results2, comments:""}) 
            }


            if (!results3[0])
                res.render('mypage', {logined:"true", email:req.session.email, users:results, questions:results2, comments:""})

            res.render('mypage', {logined:"true", email:req.session.email, users:results, questions:results2, comments:results3})
        });
    });
  });
}

module.exports.hash = hash
module.exports.emailCheck = emailCheck
module.exports.join = join
module.exports.login = login
module.exports.emailSearch = emailSearch
module.exports.pwdSearch = pwdSearch
module.exports.setPw = setPw
module.exports.mypage = mypage