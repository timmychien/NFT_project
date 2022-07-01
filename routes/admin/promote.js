var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    if (req.session.role != 'admin') {
        res.redirect('/');
    }
    var pool=req.connection;
    pool.getConnection(function(err,connection){
        connection.query('SELECT DISTINCT author from art_works', function (err, rows) {
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                })
            } else {
                var names = rows;
                res.render('admin/promote_choose', {
                    title: '選擇創作者',
                    names: names,
                    email: req.session.email,
                    role: req.session.role,
                    upgrade: req.session.upgrade,
                    walletaddress: req.session.walletaddress
                });
            }
        })
        connection.release();
    })
});
router.post('/', function (req, res) {
   var author=req.body['select_author'];
   console.log(author)
    res.redirect('/promote/' + author);
})
router.get('/:author',function(req,res){
    var pool = req.connection;
    var author=req.params.author;
    pool.getConnection(function (err, connection) {
        connection.query('SELECT * FROM art_works WHERE author=? AND promote=0', [author], function (err, rows) {
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                })
            } else {
                var data = rows;
                res.render('admin/promote_overview', {
                    title: '創作者作品總覽',
                    data: data,
                    email: req.session.email,
                    role: req.session.role,
                    walletaddress: req.session.walletaddress
                });
            }
        })
        connection.release();
    })
    
})
router.post('/:author', function (req, res) {
    var author=req.params.author;
    var name=req.body['name'];
    var pool=req.connection;
    pool.getConnection(function(err,connection){
        connection.query('UPDATE art_works SET promote=1 WHERE author=?AND name=?',[author,name],function(err,rows){
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                })
            }else{
                console.log('promote success')
                res.redirect('/')
            }
        })
    })
});
module.exports = router;