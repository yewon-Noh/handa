// 검색 관련
const conn = require('./dbConfig');

// 검색 수행
function search(req, res){
    var word = req.body.word;
    var sql = 'SELECT q.*, h_name FROM question q, hashtag h WHERE q.h_id = h.h_id and h_name=?';

    conn.query(sql, [word], function(err, results) {
        if(err){
            console.log(err);
            return res.render('search', {word:word, results:""})
        }

        if(!results[0]){
            return res.render('search', {word:word, results:""})
        }

        return res.render('search', {word:word, results:results})
    })
}

module.exports.search = search