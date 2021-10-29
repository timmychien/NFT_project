var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    if (!req.session.email) {
        res.redirect('/login');
    }
    res.render('personal/myinfo', {
        title: '我的個人資料',
        email:req.session.email,
        name:req.session.userfirstname+req.session.userlastname,
        walletaddress:req.session.walletaddress,
        address:req.session.home_address,
        cellphone:req.session.cellphone,
        role: req.session.role
    });

});

module.exports = router;