var express = require('express');
var router = express.Router();
var Web3=require('web3');
var Tx=require('ethereumjs-tx').Transaction;
require('dotenv').config();
const web3=new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://rinkeby.infura.io/v3/991b420c343949d991d7de33d4d75717"));
var votingAddress ="0xB57df45dA8c59b4Bd65f9Fb9E37Afdff7ab03149";
var abi=require('../votingABI');
var abi=abi.votingABI;
var contract=web3.eth.contract(abi).at(votingAddress);
/* GET home page. */
router.get('/', function (req, res) {
    if(!req.session.email){
        res.redirect('/login')
    }else{
        res.render('admin/createvote', {
            title: 'Express',
            email: req.session.email,
            role: req.session.role
        });
    }
    
});
router.post('/',function(req,res){
    var topic=req.body['topic'];
    var startAddTime=req.body['startAddTime'];
    var endAddTime=req.body['endAddTime'];
    var startVoteTime = req.body['startVoteTime'];
    var endVoteTime = req.body['endVoteTime'];
    var startAdd = new Date(startAddTime);
    var startAddStamp = parseInt(Math.round(startAdd.getTime()))/1000;
    var endAdd =new Date(endAddTime);
    var endAddStamp = parseInt(Math.round(endAdd.getTime()))/1000;
    var startVote = new Date(startVoteTime);
    var startVoteStamp = parseInt(Math.round(startVote.getTime()))/1000;
    var endVote = new Date(endVoteTime);
    var endVoteStamp = parseInt(Math.round(endVote.getTime()))/1000;
    var pool=req.connection;
    var address = process.env.PLATFORM_ADDR;
    var privkey = Buffer.from(process.env.PRIV_KEY, 'hex');
    var count = web3.eth.getTransactionCount(address);
    var data = contract.createVoting.getData(topic, startAddStamp, endAddStamp, startVoteStamp, endVoteStamp, { from: address });
    //var gasPrice=web3.toWei(40,'gwei');
    var gasPrice = web3.eth.gasPrice;
    var gasLimit = 3000000;
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
    pool.getConnection(function (err, connection){
        var votingId = contract.getTotalVoting().toNumber() + 1;
        connection.query('INSERT INTO Voting(votingId,topic,startAdd,endAdd,startVote,endVote,startAddstamp,endAddstamp,startVotestamp,endVotestamp)VALUES(?,?,?,?,?,?,?,?,?,?)',[votingId,topic,startAddTime,endAddTime,startVoteTime,endVoteTime,startAddStamp,endAddStamp,startVoteStamp,endVoteStamp],function(err,rows){
            if(err){
                res.render('error',{
                    message:err.message,
                    error:err
                })
            }else{
                console.log('Submit Success')
                res.render('admin/submit_redirect',{
                    hash:'https://rinkeby.etherscan.io/tx/'+hash
                });
            }
        })
    connection.release()
    })
})
module.exports = router;