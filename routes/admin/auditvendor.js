var express = require('express');
var router = express.Router();
router.get('/', function (req, res) {
    var pool=req.connection;
    pool.getConnection(function(err,connection){
        connection.query('SELECT * FROM member_info WHERE upgradeApply=?',['true'],function(err,rows){
            var list=rows;
            res.render('admin/auditvendor', {
                title: '待審核申請者',
                list: list,
                email: req.session.email,
                role: req.session.role,
                upgrade: req.session.upgrade,
            })
        })
        connection.release();
    })
    
})
router.post('/',function(req,res){
    var name=req.body['name'];
    var email=req.body['email'];
    var pool=req.connection;
    pool.getConnection(function(err,connection){
        connection.query('UPDATE member_info SET role=?,upgradeApply=? WHERE Name=? AND email=?', ['vendor', 'upgraded',name,email],function(err,rows){
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                })
            }else{
                res.redirect('/auditvendor');
            }
        })
        connection.release();
    })
})
module.exports = router;