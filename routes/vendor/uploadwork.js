var express = require('express');
var router = express.Router();
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nftproject-8e16194c11-node-0d55c2a5.baas.twcc.ai"));
var vendorAddress = "0xAc79aC8B2EF6d54dc241038b993f0eDC45434e93";
var abi = require('../vendorABI');
var abi = abi.vendorABI;
var contract = web3.eth.contract(abi).at(vendorAddress);
const customCommon = Common.forCustomChain(
    "mainnet",
    {
        name: "nftproject",
        chainId: 13330,
        networkId: 13330,
    },
    "petersburg"
);
router.post("/", function (req, res) {
    var pool = req.connection;
    //var tokenaddress = req.params.contractaddress;
    var tokenaddress=req.body['tokenaddress']
    console.log(tokenaddress)
    var collectionabi = require('../collectionABI');
    var collectionabi = collectionabi.collectionABI;
    var collectioncontract = web3.eth.contract(collectionabi).at(tokenaddress);
    var ipfsuri = req.body['work_ipfsuri'];
    var name = req.body['work_name'];
    var description = req.body['work_description'];
    var price = req.body['work_price'];
    /*
    console.log(ipfsuri);
    var vendor = req.session.walletaddress;
    var address = req.session.walletaddress;
    var privkey = Buffer.from(req.session.pk, "hex");
    var data = contract.singleMint.getData(tokenaddress, vendor, ipfsuri, name, description, price);
    var count = web3.eth.getTransactionCount(address);
    var gasPrice = web3.eth.gasPrice.toNumber() * 2;
    var gasLimit = 3000000;
    var rawTx = {
        "from": address,
        "nonce": web3.toHex(count),
        "gasPrice": web3.toHex(gasPrice),
        "gasLimit": web3.toHex(gasLimit),
        "to": vendorAddress,
        "value": 0x0,
        "data": data,
        "chainId": 13144
    }
    var tx = new Tx(rawTx, { common: customCommon });
    tx.sign(privkey);
    var serializedTx = tx.serialize();
    var hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
    console.log(hash)
    setTimeout(function () {
        var tokenId = collectioncontract.balanceOf.call(vendor).toNumber();
        console.log(tokenId);
        pool.getConnection(function (err, connection) {
            connection.query("INSERT INTO goods_onsell(contract,tokenid,name,tokenURI,price)VALUES(?,?,?,?,?)", [tokenaddress,tokenId,name,ipfsuri,price],function(err,rows){
                if(err){
                    console.log(err)
                }else{
                    res.render('vendor/list_redirect');
                }
                
            })
            connection.release();
        })
    },10000)*/
    res.redirect('/goodupload')

});
module.exports = router;