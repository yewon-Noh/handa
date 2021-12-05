const express = require('express');
const ejs = require('ejs');

const app = express();

app.set('port', process.env.PORT || 3000);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'))

app.get('/', function (req, res) {
    res.render('welcome')

});

app.get('/login', function(req, res){
    res.render('login');
})

app.get('/join', function(req, res){
    res.render('join');
})

app.get('/idPw', function(req, res){
    res.render('idPw');
})

app.use('/setPw', function(req, res){
    res.render('setPw');
})
// app.get('/study', function (req, res) {
//     res.render('study')

// });

// app.get('/study/1', function (req, res) {
//     res.render('study1')

// });

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


app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});