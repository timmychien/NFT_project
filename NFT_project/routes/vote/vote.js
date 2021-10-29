var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:topic', function (req, res) {
    if(!req.session.email){
        res.redirect('/')
    }
    var topic = req.params.topic;
    var pool=req.connection;
    pool.getConnection(function(err,connection){
        connection.query('SELECT * FROM voting WHERE topic=?',[topic],function(err,rows){
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                })
            }else{
                var startVote=rows[0].startVotestamp;
                var now=parseInt(Date.now()/1000);
                console.log(now)
                console.log(startVote)
                if(now<startVote){
                    res.render('vote/vote_warn',{
                        warn:'投票時間尚未開始！'
                    })
                }else{
                    var votingId = rows[0].votingId;
                    connection.query('SELECT * FROM art_works WHERE votingId=?', [votingId], function (err, rows) {
                        if (err) {
                            res.render('error', {
                                message: err.message,
                                error: err
                            })
                        } else {
                            var data = rows;
                            res.render('vote/vote', {
                                title: 'Express',
                                topic: topic,
                                data: data,
                                email: req.session.email,
                                role: req.session.role
                            });
                        }
                    })
                }
                
            }
        })
        connection.release();
    })
    
});

module.exports = router;
