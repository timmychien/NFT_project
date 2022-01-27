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
router.get('/:topic',function (req, res) {
    var topic=req.params.topic;
    if(!req.session.email){
        res.redirect('/');
    }
    res.render('signup/signup', {
        title: '報名',
        topic: topic,
        email: req.session.email,
        authoraddress: req.session.walletaddress,
        role: req.session.role,
    });
            
});
router.post('/:topic',function(req,res){
    var topic=req.params.topic;
    console.log(topic)
    var nftname=req.body['name'];
    var nftsymbol=req.body['symbol'];
    var author = req.session.name;
    var uri=req.body['ipfsuri'];
    console.log(req.body)
    console.log(author)
    var authoraddress = req.session.walletaddress;
    console.log(authoraddress)
    console.log(uri)
    var pool = req.connection;
    pool.getConnection(function (err, connection) {
        connection.query('SELECT * FROM voting WHERE topic=?', [topic], function (err, rows) {
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                })
            } else {
                var now=Date.now();
                var votingId = rows[0].votingId;
                console.log(votingId)
                var startAdd = rows[0].startAdd;
                var startdate = new Date(startAdd);
                var endAdd = rows[0].endAdd;
                var enddate = new Date(endAdd);
                if (now < startdate) {
                    res.render('signup/signup', {
                        warn: '報名時間尚未開始!'
                    })
                } else if (now > enddate) {
                    res.render('signup/signup', {
                        warn: '報名已截止!'
                    })
                } else {
                    var address=process.env.PLATFORM_ADDR;
                    var privkey = Buffer.from(process.env.PRIV_KEY, 'hex');
                    var count = web3.eth.getTransactionCount(address);
                    var nowtime = parseInt(Date.now() / 1000);
                    var data = contract.createCandidate.getData(votingId, nftname, nftsymbol, uri, author, authoraddress, nowtime, { from: address });
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
                    var participantId=contract.getTotalParticipant(votingId).toNumber()+1;
                    console.log(participantId)
                    pool.getConnection(function (err, connection) {
                        connection.query('INSERT INTO art_works(votingId,participantId,topic,name,symbol,author,uri,authoraddress,available,promote)VALUES(?,?,?,?,?,?,?,?,?,?)', [votingId, participantId,topic,nftname, nftsymbol, author,uri,authoraddress,1,1], function (err, rows) {
                            if (err) {
                                res.render('error', {
                                message: err.message,
                                error: err
                            })
                            }else{
                                console.log('Submit Success')
                                res.render('signup/submit_redirect', {
                                    hash: 'https://rinkeby.etherscan.io/tx/' + hash
                                });
                            }
                        })
                            })
                            connection.release();
                        }
                    
                }
        })
    connection.release();
    })   
})
router.get('/:topic/:address',function(req,res){
    var pool = req.connection;
    var walletaddress = req.params.address;
    var now = parseInt(Date.now() / 1000);
    pool.getConnection(function (err, connection) {
        connection.query('SELECT * FROM art_works WHERE authoraddress=? AND available=? AND votingId=?', [walletaddress, 0, 0], function (err, rows) {
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                })
            } else {
                var data = rows;
                res.render('signup/choose_work',{
                    data:data
                })
            }
        })
    })
})
router.post('/:topic/:address',function(req,res){
    var topic=req.params.topic;
    var authoraddress = req.params.address;
    var nftname = req.body['name'];
    var nftsymbol = req.body['symbol'];
    var author = req.session.name;
    var uri = req.body['uri'];
    console.log(authoraddress)
    console.log(uri)
    var pool = req.connection;
    pool.getConnection(function (err, connection) {
        connection.query('SELECT * FROM voting WHERE topic=?', [topic], function (err, rows) {
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                })
            } else {
                var now = Date.now();
                var votingId = rows[0].votingId;
                console.log(votingId)
                var startAdd = rows[0].startAdd;
                var startdate = new Date(startAdd);
                var endAdd = rows[0].endAdd;
                var enddate = new Date(endAdd);
                if (now < startdate) {
                    res.render('signup/signup', {
                        warn: '報名時間尚未開始!'
                    })
                } else if (now > enddate) {
                    res.render('signup/signup', {
                        warn: '報名已截止!'
                    })
                } else {
                    var address = process.env.PLATFORM_ADDR;
                    var privkey = Buffer.from(process.env.PRIV_KEY, 'hex');
                    var count = web3.eth.getTransactionCount(address);
                    var nowtime = parseInt(Date.now() / 1000);
                    var data = contract.createCandidate.getData(votingId, nftname, nftsymbol, uri, author, authoraddress, nowtime, { from: address });
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
                    pool.getConnection(function (err, connection) {
                        connection.query('UPDATE art_works SET votingId =?, participantId =?, topic =?, available =? WHERE name =? AND symbol =?',[votingId,participantId,topic,1,nftname,nftsymbol], function (err, rows) {
                            if (err) {
                                res.render('error', {
                                    message: err.message,
                                    error: err
                                })
                            } else {
                                console.log('Submit Success')
                                res.render('signup/submit_redirect', {
                                    hash: 'https://rinkeby.etherscan.io/tx/' + hash
                                });
                            }
                        })
                    })
                    connection.release();
                }

            }
        })
        connection.release();
    })   
})
module.exports = router;