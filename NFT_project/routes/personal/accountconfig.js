var express = require('express');
var router = express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://rinkeby.infura.io/v3/991b420c343949d991d7de33d4d75717"));
var abi = require('../pointABI');
var abi = abi.pointABI;
var pointAddress = "0x10aa52833fb0baa0f3f380f3bd00dc534afd008a";
var contract = web3.eth.contract(abi).at(pointAddress);
/* GET home page. */
router.get('/', function (req, res) {
    if (!req.session.email) {
        res.redirect('/login');
    }
    res.render('personal/accountconfig', {
        title: '兌換代幣',
        walletaddress:req.session.walletaddress,
        email: req.session.email,
        role: req.session.role,
    });

});
router.post('/',function(req,res){
    var toaddress=req.session.walletaddress;
    var nowbalance=1000;
    var tochange=req.body['tochange'];
    var limit=parseInt(nowbalance/100);
    if(tochange>limit){
        res.render('personal/not_enough_point')
    }
    else{
        var address = process.env.PLATFORM_ADDR;
        var privkey = Buffer.from(process.env.PRIV_KEY, 'hex');
        var count = web3.eth.getTransactionCount(address);
        var data = contract.operatorMint.getData(toaddress, tochange, '0x', '0x', { from: address });
        var gasPrice = web3.eth.gasPrice;
        var gasLimit = 3000000;
        var rawTx = {
            "from": address,
            "nonce": web3.toHex(count),
            "gasPrice": web3.toHex(gasPrice),
            "gasLimit": web3.toHex(gasLimit),
            "to": pointAddress,
            "value": 0x0,
            "data": data,
            "chainId": 0x04
        }
        var tx = new Tx(rawTx, { chain: 'rinkeby' });
        tx.sign(privkey);
        var serializedTx = tx.serialize();
        var hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
        console.log(hash)
        res.render('personal/exchange_redirect', {
            hash: 'https://rinkeby.etherscan.io/tx/' + hash
        });
    }
   
})

module.exports = router;