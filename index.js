require("dotenv").config();

const express = require('express');
const ejs = require('ejs');
var session = require('express-session');
// var MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');

const dbOptions = require('./public/js/dbConfig');
const user = require('./public/js/user');
const search = require('./public/js/search');
const solutions = require('./public/js/solutions');
const conn = require('./public/js/dbConfig');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('port', process.env.PORT || 3000);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(
    session({
        // httpOnly: false,
        secret: 'session_abcd',
        // store: new MySQLStore(dbOptions),
        resave: false,
        saveUninitialized: false,
    })
);

app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static('public'))


app.get('/', function (req, res) {
    if(!req.session.is_logined)
        res.render('welcome', {logined:"false", email:""})
    else
        res.render('welcome', {logined:"true", email:req.session.email})
});

app.get('/login', function(req, res){
    res.render('login', {email:'', message_email:'', message_pw:''})
})

app.post('/login', function(req, res){
    user.login(req, res)
})

app.get('/logout', function(req, res){
    req.session.destroy(function (err) {
        res.redirect('/')
    })
})

app.get('/join', function(req, res){
    res.render('join');
})

app.post('/join', function(req, res){
    user.join(req, res)
})

app.post('/join/email', function (req, res){
    user.emailCheck(req, res)
})

app.get('/idPw', function(req, res){
    res.render('idPw');
})

app.post('/idPw/id', function(req, res){
    user.emailSearch(req, res)
})

app.post('/idPw/pw', function(req, res){
    user.pwdSearch(req, res)
})

app.post('/idPw/setPw', function(req, res){
    user.setPw(req, res)
})

app.use('/setPw', function(req, res){
    res.render('setPw');
})

app.get('/my', function(req, res){
    if(!req.session.is_logined)
        res.render('mypage', {logined:"false", email:""})
    else
        res.render('mypage', {logined:"true", email:req.session.email})
})

app.get('/search', function (req, res) {
    if(!req.session.is_logined)
        res.render('search', {logined:"false", email:""})
    else
        res.render('search', {logined:"true", email:req.session.email})

});

app.post('/search', function (req, res) {
    // console.log(req.body.a);
    search.search(req, res);
});

app.get('/solutions', function (req, res) {
    // if(!req.session.is_logined)
    //     res.render('solutions', {logined:"false", email:""})
    // else
    //     res.render('solutions', {logined:"true", email:req.session.email})
    solutions.solutions(req, res)

});

app.post('/solutions', function (req, res){
    solutions.solutions(req, res)
})

app.post('/solutions/add', function (req, res){
    solutions.add(req, res)
})



app.get('/question', function(req, res) {
    if(!req.session.is_logined)
        res.render('question', {logined:"false", email:""})
    else
        res.render('question', {logined:"true", email:req.session.email})
})

app.get('/chat', function(req, res) {
    if(!req.session.is_logined)
        res.render('chat', {logined:"false", email:""})
    else
        res.render('chat', {logined:"true", email:req.session.email})
})

var chat = io.on('connection', (socket)=>{
    socket.on('request_message', (msg) => {
        // response_message로 접속중인 모든 사용자에게 msg 를 담은 정보를 방출한다.
        // io.emit('response_message', msg);

        var room = msg.room;
        console.log(room)
        conn.query("INSERT INTO chat_1 (room, uname, msg) VALUES (?, ?, ?)", [
            msg.room, msg.name, msg.msg
          ], function(){
            console.log('Data Insert OK');
        });
        socket.join(room);
        chat.to(room).emit('rMsg', msg);
    });

    socket.on('disconnect', async () => {
        console.log('user disconnected');
    });
});

// TEST CODE GOES HERE
(async function(){
})();


// app.listen(app.get('port'), () => {
//     console.log(app.get('port'), '번 포트에서 대기중');
// });


http.listen(3000, () => {
    console.log('Connected at 3000');
});