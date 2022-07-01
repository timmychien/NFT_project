var express = require('express');
var router = express.Router();
require('dotenv').config();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://rinkeby.infura.io/v3/991b420c343949d991d7de33d4d75717"));
var votingAddress = "0xA37A3C77EDeC40581321e6bd67f616Cad462bbA0";
var abi = require('../votingABI');
var abi = abi.votingABI;
var contract = web3.eth.contract(abi).at(votingAddress);
/* GET home page. */
router.get('/', function (req, res) {
    if (!req.session.email) {
        res.redirect('/login');
    }
    if (req.session.isverified == 0) {
        console.log('need verify')
        res.redirect('/verify');
    }
    var pool=req.connection;
    var walletaddress=req.session.walletaddress;
    var now = parseInt(Date.now() / 1000);
    pool.getConnection(function(err,connection){
        connection.query('SELECT * FROM art_works WHERE authoraddress=? AND available=? AND votingId=?', [walletaddress,0,0],function(err,rows){
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                })
            }else{
                var data=rows;
                connection.query('SELECT topic FROM voting WHERE startAddstamp<? AND endAddstamp>?', [now, now], function (err, rows) {
                    if (err) {
                        res.render('error', {
                            message: err.message,
                            error: err
                        })
                    } else {
                        var topics = rows;
                        res.render('personal/mywork', {
                            title: '我的作品',
                            data: data,
                            email: req.session.email,
                            role: req.session.role,
                            upgrade: req.session.upgrade,
                            topics: topics,
                        });
                    }
                })
            }
        })
        connection.release();
    })
    

});
router.post('/',function(req,res){
    var topic = req.body['topicselect'];
    console.log(topic)
    var pool=req.connection;
    pool.getConnection(function(err,connection){
        connection.query('SELECT * FROM voting WHERE topic=?',[topic],function(err,rows){
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                })
            }else{
                var votingId = rows[0].votingId;
                var name = req.body['name'];
                var symbol = req.body['symbol'];
                var uri = req.body['uri'];
                console.log(votingId,name,symbol,uri)
                var author = req.session.userfirstname + req.session.userlastname;
                var authoraddress = req.session.walletaddress;
                var nowtime = Date.now();
                var address = process.env.PLATFORM_ADDR;
                var privkey = Buffer.from(process.env.PRIV_KEY, 'hex');
                var count = web3.eth.getTransactionCount(address);
                var nowtime = parseInt(Date.now() / 1000);
                var data = contract.createCandidate.getData(votingId, name, symbol, uri, author, authoraddress, nowtime, { from: address });
                var gasPrice = web3.eth.gasPrice;
                var gasLimit = 5000000;
                var rawTx = {
                    "from": address,
                    "nonce": web3.toHex(count),
                    "gasPrice": web3.toHex(gasPrice),
                    "gasLimit": web3.toHex(gasLimit),
                    "to": votingAddress,
                    "value": 0x0,
                    "data": data,
                    "chainId": 0x04
                }
                var tx = new Tx(rawTx, { chain: 'rinkeby' });
                tx.sign(privkey);
                var serializedTx = tx.serialize();
                var hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
                console.log(hash)
                var participantId = contract.getTotalParticipant(votingId).toNumber() + 1;
                console.log(participantId)
                connection.query('UPDATE art_works SET votingId=?,participantId=?,topic=?,available=? WHERE name=?AND symbol=?',[votingId,participantId,topic,1,name,symbol],function(err,rows){
                    if (err) {
                        res.render('error', {
                        message: err.message,
                        error: err
                        })
                    }
                    else {
                        console.log('Submit Success')
                        res.render('signup/submit_redirect', {
                            hash: 'https://rinkeby.etherscan.io/tx/' + hash
                        });
                    }
                })
            }
        })
        connection.release();
    })
})
module.exports = router;