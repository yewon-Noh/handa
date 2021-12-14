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

// 질문
function question(email, req, res){

    var ct_id = req.body.title;
    var h_id = req.body.stitle;
    var img_name = req.file.originalname;

    // console.log(email)
    // console.log(ct_name)
    // console.log(h_name)
    // console.log(img_name)

    var sql = 'INSERT INTO question VALUES(null,?,?,?,?, now())';
    conn.query(sql, [ct_id, email, img_name, h_id], function (err, results) {
        if (err){
            console.log(err);
                        
        }    
            
        if(!req.session.is_logined)
            res.render('success', {logined:"false", email:""})
        else
            res.render('success', {logined:"true", email:req.session.email})
            
        });//query

    // var email = req.session.email;
    // var ct_name = req.body.ct_name;
    // var h_name = req.body.h_name;
    // var img_name = req.file.originalname;

    // console.log(ct_name)
    // console.log(h_name)

    // var sql = 'SELECT ct_id, h_id FROM category, hashtag WHERE ct_name=? and h_name=?';
    //     conn.query(sql, [ct_name, h_name], function(err, results) {
    //         if(err){
    //             console.log(err);
    //         }
    
    //         if(!results[0]){

    //         }
    //         console.log(results[0])
    //             var ct_id = results[0].ct_id;
    //             var h_id = results[0].h_id;

    //             var sql = 'INSERT INTO question VALUES(null,?,?,?,?)';
    //             conn.query(sql, [ct_id, email, img_name, h_id], function (err, results) {
    //                 if (err){
    //                     console.log(err);
                        
    //                 }    
            
    //                 if(!req.session.is_logined)
    //                     res.render('search', {logined:"false", email:""})
    //                 else
    //                     res.render('search', {logined:"true", email:req.session.email})
            
    //             });//query
            

    //     })

    

   
}

module.exports.question = question
module.exports.solutions = solutions
module.exports.add = add