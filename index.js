require("dotenv").config();

const express = require('express');
const ejs = require('ejs');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');

const dbOptions = require('./public/js/dbConfig');
const user = require('./public/js/user');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

var socketList = [];

app.set('port', process.env.PORT || 3000);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret',
    store: new MySQLStore(dbOptions),
    resave: false,
    saveUninitialized: false
}));

app.use(express.static('public'))


app.get('/', function (req, res) {
    res.render('welcome')

});

app.get('/login', function(req, res){
    res.render('login', {email:'', message_email:'', message_pw:''})
})

app.post('/login', function(req, res){
    user.login(req, res)
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

app.get('/search', function (req, res) {
    res.render('search')

});

app.get('/solutions', function (req, res) {
    res.render('solutions')

});

app.get('/question', function(req, res) {
    res.render('question');
})

app.get('/chat', function(req, res) {
    res.render('chat');
})

app.get('/_chat', function(req, res) {
    res.render('_chat');
})

app.get('/mypage', function(req, res) {
    res.render('mypage');
})


// app.use('/_chat', function(req, resp) {
//     resp.sendFile(__dirname + '/_chat');
// });


// io.on('connection', (socket)=>{
//     socket.on('request_message', (msg) => {
//         // response_message로 접속중인 모든 사용자에게 msg 를 담은 정보를 방출한다.
//         io.emit('response_message', msg);
//     });

//     socket.on('disconnect', async () => {
//         console.log('user disconnected');
//     });
// });





// // TEST CODE GOES HERE
// (async function(){
// })();

//은선
// var server = http.createServer(app);
// var io = require('socket.io')(server);

// io.on('connection', (socket) => {
//     socket.on('chat message', (message) => {
//       io.emit('chat message', message);
//     });
//   });
  

io.on('connection', function(socket) {
    socketList.push(socket);
    console.log('User Join');
 
    socket.on('SEND', function(message) {
        console.log(message);
        socketList.forEach(function(item, i) {
            console.log(item.id);
            if (item != socket) {
                item.emit('SEND', message);
            }
        });
    });
 
    socket.on('disconnect', function() {
        socketList.splice(socketList.indexOf(socket), 1);
    });
});


// app.listen(app.get('port'), () => {
//     console.log(app.get('port'), '번 포트에서 대기중');
// });




http.listen(3000, () => {
    console.log('Connected at 3000');
});

