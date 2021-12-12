// 검색 관련
const { DOUBLE } = require('mysql/lib/protocol/constants/types');
const conn = require('./dbConfig');

// 검색 수행
function solutions(req, res){
    var q_id = req.body.q_id;
    var sql = 'SELECT q.*, ct_name, h_name FROM question q, category ct, hashtag h WHERE q.h_id = h.h_id and q.ct_id = ct.ct_id and q_id=?';

    conn.query(sql, [q_id], function(err, results) {
        if(err){
            console.log(err);
            return res.render('solutions', {results:"", comments:""})
        }

        if(!results[0]){
            return res.render('solutions', {results:"", comments:""})
        }

        var _sql = 'SELECT * FROM comment WHERE q_id=?'
        conn.query(_sql, [q_id], function(err, comments) {
            if(err){
                console.log(err);
                if(!req.session.is_logined)
                    return res.render('solutions', {logined:"false", email:"", results:results, comments:""})
                else 
                    return res.render('solutions', {logined:"true", email:req.session.email, results:results, comments:""})
            }
    
            if(!results[0]){
                if(!req.session.is_logined)
                    return res.render('solutions', {logined:"false", email:"", results:results, comments:""})
                else 
                    return res.render('solutions', {logined:"true", email:req.session.email, results:results, comments:""})
            }

            if(!req.session.is_logined)
                return res.render('solutions', {logined:"false", email:"", results:results, comments:comments})
            else 
                return res.render('solutions', {logined:"true", email:req.session.email, results:results, comments:comments})
        })
    })
}

// 댓글달기
function add(req, res){
    var email = req.body.email;
    var comment = req.body.comment;
    var q_id = req.body.q_id;

    if(comment==""){
        solutions(req, res)
    }
    else {
        var sql = 'INSERT INTO comment VALUES(null,?,?,?,NOW())';
        conn.query(sql, [q_id, email, comment], function (err, results) {
            if (err){
                console.log(err);
                return res.send("-1");
            }    
    
            solutions(req, res)
    
        });//query
    }

    
}

module.exports.solutions = solutions
module.exports.add = add