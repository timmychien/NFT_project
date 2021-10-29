var express = require('express');
var router = express.Router();
var Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://rinkeby.infura.io/v3/991b420c343949d991d7de33d4d75717"));
/* GET home page. */
router.get('/', function (req, res) {
    if(req.session.verified==0){
        res.render('verify/verify', {
            title: 'Verify',
            email: req.session.email,
            role: req.session.role
        });
    }
    else{
        res.redirect('/')
    }
});

router.post('/',function(req,res){
    var signature=req.body['signature'];
    console.log(signature)
    var pool=req.connection;
    pool.getConnection(function(err,connection){
        connection.query('UPDATE  member_info SET isverified=?, sig=? WHERE email=?',[1,signature,req.session.email],function(err,rows){
            if(err){
                res.render('error', {
                    message: err.message,
                    error: err
                })
            }else{
                req.session.verified =1;
                console.log('update success')
                res.render('verify/verify_redirect');
            }
        })
    connection.release();
    });
    
})
module.exports = router;