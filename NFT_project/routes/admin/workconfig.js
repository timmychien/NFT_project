var express=require('express');
var router = express.Router();
router.get('/',function(req,res){
    if(req.session.role!='admin'){
        res.redirect('/');
    }
    var pool=req.connection;
    pool.getConnection(function(err,connection){
        connection.query('SELECT * FROM art_works WHERE available=1',function(err,rows){
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                })
            }else{
                var data=rows;
                res.render('admin/workconfig', {
                    data:data,
                    title: '作品管理',
                    email: req.session.email,
                    role: req.session.role
                })
            }
        })
        connection.release();
    })
    
    
})
router.post('/',function(req,res){
    var votingId=req.body['votingId'];
    var participantId=req.body['participantId'];
    console.log(votingId)
    console.log(participantId)
    var pool=req.connection;
    pool.getConnection(function(err,connection){
        connection.query('UPDATE art_works SET available=0 WHERE votingId=? and participantId=?',[votingId,participantId],function(err,rows){
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                })
            }else{
                console.log('update success');
                res.redirect('/');
            }
        })
        connection.release();
    })
})
module.exports = router;