const conn = require('./dbConfig');

function chat(req, res){
    var email = req.session.email;

    var sql = 'SELECT * FROM chat WHERE u1_email=? OR u2_email=?';
    conn.query(sql, [email, email], function (err, results) {
        if (err){
            console.log(err);
            res.render('chat', {logined:"true", email:req.session.email, rooms:""})
        }

        if (!results[0]){
            res.render('chat', {logined:"true", email:req.session.email, rooms:""})
        }

        console.log(results)
        res.render('chat', {logined:"true", email:req.session.email, rooms:results})
        // for(var i=0; i<results.length; i++){
        //     var ct_id = results[id].ct_id;
        //     var 
        //     if(email == results[])
        // }
    });//query
}

module.exports.chat = chat