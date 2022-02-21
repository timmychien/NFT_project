var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('login', { title: '登入' });
});
router.post('/',function(req,res,next){
    var email=req.body['email'];
    var userpass=req.body['userpass'];
    var pool=req.connection;
    pool.getConnection(function(error,connection){
        connection.query('SELECT email FROM member_info WHERE email=?',[email],function(err,rows){
            if(err){
                res.render('error',{
                    message:err.message,
                    error:err
                })
            }
            if(rows.length==0){
                res.render('login',{warn1:"查無此帳號"});
            }
            if(rows.length==1){
                connection.query('SELECT * FROM member_info WHERE email=? AND password=?',[email,userpass],function(err,rows){
                    if(rows.length==0){
                        res.render('login',{warn2:"密碼錯誤"});
                    }
                    if(rows.length==1){
                        req.session.email=req.body['email'];
                        req.session.userpass=req.body['userpass'];
                        req.session.userfirstname=rows[0].Firstname;
                        req.session.userlastname=rows[0].Lastname;
                        req.session.role=rows[0].role;
                        req.session.walletaddress=rows[0].address;
                        req.session.verified=rows[0].isverified;
                        req.session.home_address=rows[0].home_address;
                        req.session.cellphone=rows[0].cellphone;
                        req.session.englishname=rows[0].englishname;
                        res.redirect('/');
                    }
                });
            }
        });
        connection.release();
    });
})
module.exports = router;