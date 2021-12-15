// 검색 관련
const conn = require('./dbConfig');

// 검색 수행
function search(req, res){
    var word = req.body.word;

    var sql;
    if(word=='정보처리산업기사')
        sql = 'SELECT q.*, ct_name, h_name FROM question q, category ct, hashtag h WHERE q.h_id = h.h_id and q.ct_id = ct.ct_id and ct_name=?';
    else 
        sql = 'SELECT q.*, ct_name, h_name FROM question q, category ct, hashtag h WHERE q.h_id = h.h_id and q.ct_id = ct.ct_id and h_name = ?';

    conn.query(sql, [word, word], function(err, results) {
        if(err){
            console.log(err);
            if(!req.session.is_logined)
                return res.render('search', {logined:"false", email:"", word:word, results:""})
            else
                return res.render('search', {logined:"true", email:req.session.email, word:word, results:""})
        }

        if(!results[0]){
            if(!req.session.is_logined)
                return res.render('search', {logined:"false", email:"", word:word, results:""})
            else
                return res.render('search', {logined:"true", email:req.session.email, word:word, results:""})
        }

        if(!req.session.is_logined)
            return res.render('search', {logined:"false", email:"", word:word, results:results})
        else
            return res.render('search', {logined:"true", email:req.session.email, word:word, results:results})
    })
}

module.exports.search = search