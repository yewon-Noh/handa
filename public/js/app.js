const mysql = require('mysql');
const dbConfig = require('./dbConfig');

var dbOptions = {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
};
var conn = mysql.createConnection(dbOptions);
conn.connect();

function set(req, res) {
    var name = req.session.name;

    // 공간 개수 확인
    var sql = 'SELECT count(*) FROM spaces WHERE email = ( SELECT email FROM `user` WHERE name=? )';
    conn.query(sql, [name], function (err, results) {
        if (err)
            console.log(err);

        if (!results[0])
            // 없을 경우 /app 바로 연결
            res.render('app', { username:req.session.name })

        var count = results[0];

        // 있을 경우 공간 정보 가져옴
        var sql_2 = 'SELECT name, img, url FROM spaces ' 
            + 'WHERE email = ( SELECT email FROM `user` WHERE name=? )'
            + 'ORDER BY createDate DESC'

            conn.query(sql_2, [name], function (err, results) {
                if (err)
                    console.log(err);

                
                // 공간 정보를 함께 페이지로 전달
                res.render('app', { username:req.session.name, results:results})

            });


        
    });//query
}

module.exports.appSet = set;