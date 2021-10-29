var express = require('express');
var router = express.Router();
var ethWallet = require('ethereumjs-wallet');
var nodemailer = require('nodemailer');
require('dotenv').config();
/* GET home page. */
router.get('/', function (req, res) {
    res.render('sign', { 
        title: '註冊',
        session:req.session.email
    });
});
router.post('/',function(req,res){
    var email=req.body['email'];
    var userpass=req.body['userpass'];
    var passcheck=req.body['passcheck'];
    var userfirstname = req.body['userfirstname'];
    var userlastname = req.body['userlastname'];
    var cellphone=req.body['cellphone'];
    var homeaddress=req.body['homeaddress'];
    var pool=req.connection;
    pool.getConnection(function(err,connection){
        connection.query('SELECT email FROM member_info WHERE email=?',[email],function(err,rows){
            if(err){
                res.render('error',{
                    message:err.message,
                    error:err
                })
            }
            if(rows.length>=1){
                res.render('sign',{warn:"此信箱已被註冊"})
            }
            if (userpass != passcheck) {
                res.render('sign', {passWarn: "與輸入密碼不符，請重新輸入" });
            }
            else{
                let addressData = ethWallet['default'].generate();
                var pk=addressData.getPrivateKeyString().replace('0x','');
                var address = addressData.getAddressString();
                var verified=0;
                connection.query('INSERT INTO member_info(email,Lastname,Firstname,password,role,isverified,privkey,address,home_address,cellphone)VALUES(?,?,?,?,?,?,?,?,?,?)', [email , userlastname, userfirstname, userpass,'member',verified,pk,address,homeaddress,cellphone],function(err,rows){
                    if(err){
                        res.redirect('/sign');
                        console.log(err)
                    }else{
                        req.session.verified=verified;
                        req.session.email=email;
                        console.log('insert success')
                        res.render('sign_redirect',{pk:pk});
                    }
                });
            }
        });
        connection.release();
    });
});

module.exports = router;