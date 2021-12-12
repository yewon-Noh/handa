// 검색 관련
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
                return res.render('solutions', {results:results, comments:""})
            }
    
            if(!results[0]){
                return res.render('solutions', {results:results, comments:""})
            }

            return res.render('solutions', {results:results, comments:comments})
        })
    })
}

module.exports.solutions = solutions