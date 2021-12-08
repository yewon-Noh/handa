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

// io.on('connection', (socket)=>{
//     socket.on('request_message', (msg) => {
//         // response_message로 접속중인 모든 사용자에게 msg 를 담은 정보를 방출한다.
//         io.emit('response_message', msg);
//     });

//     socket.on('disconnect', async () => {
//         console.log('user disconnected');
//     });
// });


//////////////은선////////////////

var express = require('express'),
    port = process.env.PORT || 3000,
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = {
        'test': {
            id: 'test',
            pw: 'test'
        }
    },
    onlineUsers = {};

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.redirect('/chat');
});

app.get('/chat', function (req, res) {
    res.sendfile(__dirname + '/chat.html');
});

server.listen(port, () => {
    console.log(`server open ${port}`);
});


io.sockets.on('connection', function (socket) {
    socket.on("join user", function (data, cb) {
        if (joinCheck(data)) {
            cb({
                result: false,
                data: "이미 존재하는 회원입니다."
            });
            return false;
        } else {
            users[data.id] = {
                id: data.id,
                pw: data.pw
            };
            cb({
                result: true,
                data: "회원가입에 성공하였습니다."
            });

        }
    });

    socket.on("login user", function (data, cb) {
        if (loginCheck(data)) {
            onlineUsers[data.id] = {
                roomId: 1,
                socketId: socket.id
            };
            socket.join('room1');
            cb({
                result: true,
                data: "로그인에 성공하였습니다."
            });
            updateUserList(0, 1, data.id);
        } else {
            cb({
                result: false,
                data: "등록된 회원이 없습니다. 회원가입을 진행해 주세요."
            });
            return false;
        }
    });

    socket.on('logout', function () {
        if (!socket.id) return;
        let id = getUserBySocketId(socket.id);
        let roomId = onlineUsers[id].roomId;
        delete onlineUsers[getUserBySocketId(socket.id)];
        updateUserList(roomId, 0, id);
    });

    socket.on('disconnect', function () {
        if (!socket.id) return;
        let id = getUserBySocketId(socket.id);
        if(id === undefined || id === null){
            return;
        }
        let roomId = onlineUsers[id].roomId || 0;
        delete onlineUsers[getUserBySocketId(socket.id)];
        updateUserList(roomId, 0, id);
    });

    socket.on('join room', function (data) {
        let id = getUserBySocketId(socket.id);
        let prevRoomId = onlineUsers[id].roomId;
        let nextRoomId = data.roomId;
        socket.leave('room' + prevRoomId);
        socket.join('room' + nextRoomId);
        onlineUsers[id].roomId = data.roomId;
        updateUserList(prevRoomId, nextRoomId, id);
    });

    function updateUserList(prev, next, id) {
        if (prev !== 0) {
            io.sockets.in('room' + prev).emit("userlist", getUsersByRoomId(prev));
            io.sockets.in('room' + prev).emit("lefted room", id);
        }
        if (next !== 0) {
            io.sockets.in('room' + next).emit("userlist", getUsersByRoomId(next));
            io.sockets.in('room' + next).emit("joined room", id);
        }
    }

    function loginCheck(data) {
        if (users.hasOwnProperty(data.id) && users[data.id].pw === data.pw) {
            return true;
        } else {
            return false;
        }
    }

    function joinCheck(data) {
        if (users.hasOwnProperty(data.id)) {
            return true;
        } else {
            return false;
        }
    }

    function getUserBySocketId(id) {
        return Object.keys(onlineUsers).find(key => onlineUsers[key].socketId === id);
    }

    function getUsersByRoomId(roomId) {
        let userstemp = [];
        Object.keys(onlineUsers).forEach((el) => {
            if (onlineUsers[el].roomId === roomId) {
                userstemp.push({
                    socketId: onlineUsers[el].socketId,
                    name: el
                });
            }
        });
        return userstemp;
    }
});

/////////////////////////////
$(function () {
    var socket = io.connect();
    var $userWrap = $('#userWrap');
    var $contentWrap = $('#contentWrap');
    var $loginForm = $('#loginForm');
    var $joinForm = $('#joinForm');
    var $chatForm = $('#chatForm');
    var $roomSelect = $('#roomSelect');
    var $memberSelect = $('#memberSelect');
    var $chatLog = $('#chatLog');
    var roomId = 1;
    var socketId = "";

    $("#loginBtn").click(function (e) {
        e.preventDefault();
        $loginForm.show();
        $joinForm.hide();
    });

    $("#joinBtn").click(function (e) {
        e.preventDefault();
        $joinForm.show();
        $loginForm.hide();
    });
    $("#logoutBtn").click(function (e) {
        e.preventDefault();
        socket.emit('logout');
        socketId = "";
        alert("로그아웃되었습니다.");
        $userWrap.show();
        $contentWrap.hide();
    });

    $roomSelect.on("click", "div", function () {
        if (roomId !== $(this).data('id')) {
            roomId = $(this).data('id');
        }
        $(this).parents().children().removeClass("active");
        $(this).addClass("active");
        $chatLog.html("");
        $('#chatHeader').html(`${$(this).html()}`);
        socket.emit('join room', {
            roomId
        });
    });

    socket.on('userlist', function (data) {
        let html = "";
        data.forEach((el) => {
            if (el.socketId === socketId) {
                html += `<div class="memberEl">${el.name} (me)</div>`
            } else {
                html += `<div class="memberEl">${el.name}</div>`
            }
        });
        $memberSelect.html(html);
    });

    socket.on('lefted room', function (data) {
        $chatLog.append(`<div class="notice"><strong>${data}</strong> lefted the room</div>`)
    });
    socket.on('joined room', function (data) {
        $chatLog.append(`<div class="notice"><strong>${data}</strong> joined the room</div>`)
    });

    $loginForm.submit(function (e) {
        e.preventDefault();
        let id = $("#loginId");
        let pw = $("#loginPw");
        if (id.val() === "" || pw.val() === "") {
            alert("check validation");
            return false;
        } else {
            socket.emit('login user', {
                id: id.val(),
                pw: pw.val()
            }, function (res) {
                if (res.result) {
                    alert(res.data);
                    socketId = socket.id;
                    roomId = 1;
                    id.val("");
                    pw.val("");
                    $userWrap.hide();
                    $contentWrap.show();
                    $('#chatHeader').html("Everyone");
                } else {
                    alert(res.data);
                    id.val("");
                    pw.val("");
                    $("#joinBtn").click();
                }
            });
        }
    });

    $joinForm.submit(function (e) {
        e.preventDefault();
        let id = $("#joinId");
        let pw = $("#joinPw");
        if (id.val() === "" || pw.val() === "") {
            alert("check validation");
            return false;
        } else {
            socket.emit('join user', {
                id: id.val(),
                pw: pw.val()
            }, function (res) {
                if (res.result) {
                    alert(res.data);
                    id.val("");
                    pw.val("");
                    $("#loginBtn").click();
                } else {
                    alert(res.data);
                    return false;
                }
            });
        }
    });

});

//////////////////////////
var express = require('express'),
    port = process.env.PORT || 3000,
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = {
        'test': {
            id: 'test',
            pw: 'test'
        }
    },
    onlineUsers = {};

app.use(express.static('public'));

app.get('/_chat', function (req, res) {
    res.sendfile(__dirname + '/_chat.html');
});

server.listen(port, () => {
    console.log(`server open ${port}`);
});


io.sockets.on('connection', function (socket) {
    socket.on("join user", function (data, cb) {
        if (joinCheck(data)) {
            cb({
                result: false,
                data: "이미 존재하는 회원입니다."
            });
            return false;
        } else {
            users[data.id] = {
                id: data.id,
                pw: data.pw
            };
            cb({
                result: true,
                data: "회원가입에 성공하였습니다."
            });

        }
    });

    socket.on("login user", function (data, cb) {
        if (loginCheck(data)) {
            onlineUsers[data.id] = {
                roomId: 1,
                socketId: socket.id
            };
            socket.join('room1');
            cb({
                result: true,
                data: "로그인에 성공하였습니다."
            });
            updateUserList(0, 1, data.id);
        } else {
            cb({
                result: false,
                data: "등록된 회원이 없습니다. 회원가입을 진행해 주세요."
            });
            return false;
        }
    });

    socket.on('logout', function () {
        if (!socket.id) return;
        let id = getUserBySocketId(socket.id);
        let roomId = onlineUsers[id].roomId;
        delete onlineUsers[getUserBySocketId(socket.id)];
        updateUserList(roomId, 0, id);
    });

    socket.on('disconnect', function () {
        if (!socket.id) return;
        let id = getUserBySocketId(socket.id);
        if(id === undefined || id === null){
            return;
        }
        let roomId = onlineUsers[id].roomId || 0;
        delete onlineUsers[getUserBySocketId(socket.id)];
        updateUserList(roomId, 0, id);
    });

    socket.on('join room', function (data) {
        let id = getUserBySocketId(socket.id);
        let prevRoomId = onlineUsers[id].roomId;
        let nextRoomId = data.roomId;
        socket.leave('room' + prevRoomId);
        socket.join('room' + nextRoomId);
        onlineUsers[id].roomId = data.roomId;
        updateUserList(prevRoomId, nextRoomId, id);
    });

    function updateUserList(prev, next, id) {
        if (prev !== 0) {
            io.sockets.in('room' + prev).emit("userlist", getUsersByRoomId(prev));
            io.sockets.in('room' + prev).emit("lefted room", id);
        }
        if (next !== 0) {
            io.sockets.in('room' + next).emit("userlist", getUsersByRoomId(next));
            io.sockets.in('room' + next).emit("joined room", id);
        }
    }

    function loginCheck(data) {
        if (users.hasOwnProperty(data.id) && users[data.id].pw === data.pw) {
            return true;
        } else {
            return false;
        }
    }

    function joinCheck(data) {
        if (users.hasOwnProperty(data.id)) {
            return true;
        } else {
            return false;
        }
    }

    function getUserBySocketId(id) {
        return Object.keys(onlineUsers).find(key => onlineUsers[key].socketId === id);
    }

    function getUsersByRoomId(roomId) {
        let userstemp = [];
        Object.keys(onlineUsers).forEach((el) => {
            if (onlineUsers[el].roomId === roomId) {
                userstemp.push({
                    socketId: onlineUsers[el].socketId,
                    name: el
                });
            }
        });
        return userstemp;
    }
});


////////////////////////////
$(function () {
    var socket = io.connect();
    var $userWrap = $('#userWrap');
    var $contentWrap = $('#contentWrap');
    var $loginForm = $('#loginForm');
    var $joinForm = $('#joinForm');
    var $chatForm = $('#chatForm');
    var $roomSelect = $('#roomSelect');
    var $memberSelect = $('#memberSelect');
    var $chatLog = $('#chatLog');
    var roomId = 1;
    var socketId = "";

    $("#loginBtn").click(function (e) {
        e.preventDefault();
        $loginForm.show();
        $joinForm.hide();
    });

    $("#joinBtn").click(function (e) {
        e.preventDefault();
        $joinForm.show();
        $loginForm.hide();
    });
    $("#logoutBtn").click(function (e) {
        e.preventDefault();
        socket.emit('logout');
        socketId = "";
        alert("로그아웃되었습니다.");
        $userWrap.show();
        $contentWrap.hide();
    });

    $roomSelect.on("click", "div", function () {
        if (roomId !== $(this).data('id')) {
            roomId = $(this).data('id');
        }
        $(this).parents().children().removeClass("active");
        $(this).addClass("active");
        $chatLog.html("");
        $('#chatHeader').html(`${$(this).html()}`);
        socket.emit('join room', {
            roomId
        });
    });

    socket.on('userlist', function (data) {
        let html = "";
        data.forEach((el) => {
            if (el.socketId === socketId) {
                html += `<div class="memberEl">${el.name} (me)</div>`
            } else {
                html += `<div class="memberEl">${el.name}</div>`
            }
        });
        $memberSelect.html(html);
    });

    socket.on('lefted room', function (data) {
        $chatLog.append(`<div class="notice"><strong>${data}</strong> lefted the room</div>`)
    });
    socket.on('joined room', function (data) {
        $chatLog.append(`<div class="notice"><strong>${data}</strong> joined the room</div>`)
    });

    $loginForm.submit(function (e) {
        e.preventDefault();
        let id = $("#loginId");
        let pw = $("#loginPw");
        if (id.val() === "" || pw.val() === "") {
            alert("check validation");
            return false;
        } else {
            socket.emit('login user', {
                id: id.val(),
                pw: pw.val()
            }, function (res) {
                if (res.result) {
                    alert(res.data);
                    socketId = socket.id;
                    roomId = 1;
                    id.val("");
                    pw.val("");
                    $userWrap.hide();
                    $contentWrap.show();
                    $chatLog.html("");
                    $('#chatHeader').html("Everyone");
                } else {
                    alert(res.data);
                    id.val("");
                    pw.val("");
                    $("#joinBtn").click();
                }
            });
        }
    });

    $joinForm.submit(function (e) {
        e.preventDefault();
        let id = $("#joinId");
        let pw = $("#joinPw");
        if (id.val() === "" || pw.val() === "") {
            alert("check validation");
            return false;
        } else {
            socket.emit('join user', {
                id: id.val(),
                pw: pw.val()
            }, function (res) {
                if (res.result) {
                    alert(res.data);
                    id.val("");
                    pw.val("");
                    $("#loginBtn").click();
                } else {
                    alert(res.data);
                    return false;
                }
            });
        }
    });

    $chatForm.submit(function (e) {
        e.preventDefault();
        let msg = $("#message");
        if (msg.val() === "") {
            return false;
        } else {
            let data = {
                roomId: roomId,
                msg: msg.val()
            };
            socket.emit("send message", data);
            msg.val("");
            msg.focus();
        }
    });

    socket.on('new message', function (data) {
        if (data.socketId === socketId) {
            $chatLog.append(`<div class="myMsg msgEl"><span class="msg">${data.msg}</span></div>`)
        } else {
            $chatLog.append(`<div class="anotherMsg msgEl"><span class="anotherName">${data.name}</span><span class="msg">${data.msg}</span></div>`)
        }
        $chatLog.scrollTop($chatLog[0].scrollHeight - $chatLog[0].clientHeight);
    });
});


//////////////은선////////////////


// // TEST CODE GOES HERE
// (async function(){
// })();




// app.listen(app.get('port'), () => {
//     console.log(app.get('port'), '번 포트에서 대기중');
// });


http.listen(3000, () => {
    console.log('Connected at 3000');
});