var express = require('express');
var router = express.Router();
router.get('/',function(req,res){
    if (!req.session.email) {
        res.redirect("/login");
    }
    if (req.session.role == 'vendor') {
        res.render('apply/apply_warn', {
            warn: '此帳號已升級！'
        })
    }else{
        res.render('apply/applyforvendor', {
            title: '申請成為商家',
            email: req.session.email,
            role: req.session.role,
            upgrade: req.session.upgrade,
            walletaddress: req.session.walletaddress
        })
    }
    
})
router.post('/',function(req,res){
    var pool=req.connection;
    var email=req.session.email;
    pool.getConnection(function(err,connection){
        connection.query('UPDATE member_info SET upgradeApply=? WHERE email=?',['true',email],function(err,rows){
            res.render('apply/apply_redirect');
        })
    })
})

module.exports = router;