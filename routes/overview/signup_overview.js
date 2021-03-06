var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    var pool = req.connection;
    pool.getConnection(function (err, connection) {
        var now = parseInt(Date.now() / 1000);
        connection.query('SELECT * FROM voting WHERE startAddstamp<? AND endAddstamp>?', [now, now], function (err, rows) {
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                })
            }
            else {
                var data = rows;
                res.render('overview/signup_overview', {
                    title: '活動總覽',
                    data: data,
                    email: req.session.email,
                    role: req.session.role
                });
            }
        })
        connection.release();
    })

});
router.post('/',function(req,res){
    var vote_topic=req.body['topic'];
    res.redirect('/vote/' + vote_topic + '/' + votingId);
})

module.exports = router;