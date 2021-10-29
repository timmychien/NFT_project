var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    if (!req.session.email) {
        res.redirect('/login');
    }
    res.render('personal/mycollection', {
        title: '我的收藏品',
        email: req.session.email,
        role: req.session.role,
    });

});

module.exports = router;