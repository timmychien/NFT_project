var express=require('express');
var router=express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nftproject-8e16194c11-node-0d55c2a5.baas.twcc.ai"));
var pointabi = require('../pointABI');
var pointabi = pointabi.pointABI;
var pointAddress = "0x1e8B628Da1EBcE9B1adA7CD181cda91614762414";
var pointcontract = web3.eth.contract(pointabi).at(pointAddress);
const customCommon = Common.forCustomChain('mainnet', {
    name: 'nftproject',
    chainId: 13330,
    networkId: 13330
}, 'petersburg')
router.get('/',function(req,res){
    if(!req.session.email){
        res.redirect('/login');
    }else{
        var bal = pointcontract.balanceOf(req.session.walletaddress).toNumber();
        res.render('personal/transfertoken',{
            email: req.session.email,
            role: req.session.role,
            bal: bal
        })
    }
    
})
router.post('/',function(req,res){
    var pool=req.connection;
    var toAmount=req.body['toAmount'];
    console.log(toAmount)
    var toEmail=req.body['toEmail'];
    var nowBalance = pointcontract.balanceOf(req.session.walletaddress);
    if(toAmount==''){
        res.render('personal/transfertoken', {
            email: req.session.email,
            role: req.session.role,
            bal: nowBalance,
            warn: '您尚未輸入欲轉移點數'
        })
    }else{
        if (toEmail == req.session.email) {
            res.render('personal/transfertoken', {
                email: req.session.email,
                role: req.session.role,
                bal: nowBalance,
                emailWarn: '您無法發送點數給自己'
            })
        } else {
            pool.getConnection(function (err, connection) {
                connection.query('SELECT address FROM member_info WHERE email=?', [toEmail], function (err, rows) {
                    if (err) {
                        console.log(err)
                    } else {
                        if (rows.length == 0) {
                            res.render('personal/transfertoken', {
                                email: req.session.email,
                                role: req.session.role,
                                bal: nowBalance,
                                emailWarn: '此Email尚未註冊'
                            })
                        } else {
                            var walletaddress = rows[0].address;
                            console.log(walletaddress)
                            if (nowBalance < toAmount) {
                                res.render('personal/transfertoken', {
                                    email: req.session.email,
                                    role: req.session.role,
                                    bal: nowBalance,
                                    warn: '點數餘額不足'
                                })
                            } else {
                                var address = req.session.walletaddress;
                                var privkey = Buffer.from(req.session.pk, 'hex');
                                var data = pointcontract.transfer.getData(walletaddress, toAmount);
                                var count = web3.eth.getTransactionCount(address);
                                var gasPrice = 0;
                                var gasLimit = 3000000;
                                var rawTx = {
                                    "from": address,
                                    "nonce": web3.toHex(count),
                                    "gasPrice": web3.toHex(gasPrice),
                                    "gasLimit": web3.toHex(gasLimit),
                                    "to": pointAddress,
                                    "value": 0x0,
                                    "data": data,
                                    "chainId": 13144
                                }
                                var tx = new Tx(rawTx, { common: customCommon });
                                tx.sign(privkey);
                                var serializedTx = tx.serialize();
                                var hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
                                console.log(hash)
                                var sub_amount=-toAmount;
                                var add_amount=+toAmount;
                                var sub_info='點數移轉(轉出)';
                                var add_info='點數移轉(轉入)'
                                connection.query('INSERT INTO point_transactions(address,hash,change_amount,info) VALUES(?,?,?,?),(?,?,?,?)',[address,hash,sub_amount,sub_info,walletaddress,hash,add_amount,add_info],function(err,rows){
                                    if(err){
                                        console.log(err)
                                    }else{
                                        res.render("personal/transfer_redirect");
                                    }
                                })
                                
                            }
                        }
                    }
                    connection.release();
                })
            })
        }
    }
})
module.exports=router;