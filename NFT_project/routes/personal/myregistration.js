var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    if (!req.session.email) {
        res.redirect('/login');
    }
    else{
        var pool=req.connection
        pool.getConnection(function(err,connection){
            connection.query('SELECT * FROM art_works WHERE authoraddress=?',[req.session.walletaddress],function(err,rows){
                if(err) {
                    res.render('error', {
                        message: err.message,
                        error: err
                    })
                }else{
                    var data=rows;
                    res.render('personal/myregistration', {
                        title: '我的報名',
                        data:data,
                        email: req.session.email,
                        role: req.session.role,
                    });
                }
            })
            connection.release();
        })
        
    }
    

});

module.exports = router;