var express = require('express');
var router = express.Router();
var Web3=require('web3');
var Tx=require('ethereumjs-tx').Transaction;
var Common = require('ethereumjs-common').default;
require('dotenv').config();
const web3=new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://besu-nftproject-8e16194c11-node-0d55c2a5.baas.twcc.ai"));
var votingAddress ="0x1265cF01155a42c78a5DF92cdc07B20d9d107ddF";
var abi=require('../votingABI');
var abi=abi.votingABI;
var contract=web3.eth.contract(abi).at(votingAddress);
const customCommon = Common.forCustomChain('mainnet', {
    name: 'nftproject',
    chainId: 13330,
    networkId: 13330

}, 'petersburg')
/* GET home page. */
router.get('/', function (req, res) {
    if(!req.session.email){
        res.redirect('/')
    }else{
        res.render('admin/createvote', {
            title: 'Express',
            email: req.session.email,
            role: req.session.role,
            upgrade: req.session.upgrade,
        });
    }
    
});
router.post('/',function(req,res){
    var topic=req.body['topic'];
    var startAddTime=req.body['startAddTime'];
    var endAddTime=req.body['endAddTime'];
    var startVoteTime = req.body['startVoteTime'];
    var endVoteTime = req.body['endVoteTime'];
    var airdropamount=req.body['airdropamount'];
    var image = req.body['ipfsuri'];
    var startAdd = new Date(startAddTime);
    var startAddStamp = parseInt(Math.round(startAdd.getTime()))/1000;
    var endAdd =new Date(endAddTime);
    var endAddStamp = parseInt(Math.round(endAdd.getTime()))/1000;
    var startVote = new Date(startVoteTime);
    var startVoteStamp = parseInt(Math.round(startVote.getTime()))/1000;
    var endVote = new Date(endVoteTime);
    var endVoteStamp = parseInt(Math.round(endVote.getTime()))/1000;
    console.log(image)
    var pool=req.connection;
    var address = req.session.walletaddress;
    var privkey = Buffer.from(req.session.pk, 'hex');
    var count = web3.eth.getTransactionCount(address);
    var data = contract.createVoting.getData(topic, address,startAddStamp, endAddStamp, startVoteStamp, endVoteStamp, airdropamount,{ from: address });
    //var gasPrice=web3.toWei(40,'gwei');
    var gasPrice = 0;
    var gasLimit = 3000000;
    var rawTx = {
        "from": address,
        "nonce": web3.toHex(count),
        "gasPrice": web3.toHex(gasPrice),
        "gasLimit": web3.toHex(gasLimit),
        "to": votingAddress,
        "value": 0x0,
        "data": data,
        "chainId": 13144
    }
    var tx = new Tx(rawTx, { common:customCommon });
    tx.sign(privkey);
    var serializedTx = tx.serialize();
    var hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
    console.log(hash)
    pool.getConnection(function (err, connection){
        var votingId = contract.getTotalVoting().toNumber() + 1;
        connection.query('INSERT INTO Voting(votingId,topic,startAdd,endAdd,startVote,endVote,startAddstamp,endAddstamp,startVotestamp,endVotestamp,image,status,creator)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',[votingId,topic,startAddTime,endAddTime,startVoteTime,endVoteTime,startAddStamp,endAddStamp,startVoteStamp,endVoteStamp,image,'開放報名中',address],function(err,rows){
            if(err){
                res.render('error',{
                    message:err.message,
                    error:err
                })
            }else{
                console.log('Submit Success')
                res.render('admin/submit_redirect',{
                    //hash:'https://rinkeby.etherscan.io/tx/'+hash
                });
            }
        })
    connection.release()
    })
})
module.exports = router;