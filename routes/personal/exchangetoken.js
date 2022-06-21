var express = require("express");
var router = express.Router();
var Tx = require("ethereumjs-tx").Transaction;
var Web3 = require("web3");
var Common = require("ethereumjs-common").default;
const web3 = new Web3();
web3.setProvider(
    new web3.providers.HttpProvider(
        "https://besu-nftproject-8e16194c11-node-0d55c2a5.baas.twcc.ai"
    )
);
var abi = require("../pointABI");
var abi = abi.pointABI;
var pointAddress = "0x1e8B628Da1EBcE9B1adA7CD181cda91614762414";
var pointcontract = web3.eth.contract(abi).at(pointAddress);
const customCommon = Common.forCustomChain(
    "mainnet",
    {
        name: "nftproject",
        chainId: 13330,
        networkId: 13330,
    },
    "petersburg"
);
/* GET home page. */
router.get("/", function (req, res) {
    if (!req.session.email) {
        res.redirect("/login");
    }
    else{
        var bal = pointcontract.balanceOf(req.session.walletaddress).toNumber();
        res.render("personal/exchangetoken", {
            title: "兌換代幣",
            walletaddress: req.session.walletaddress,
            email: req.session.email,
            role: req.session.role,
            bal:bal
        });
    }
    
});
router.post("/", function (req, res) {
    var toaddress = req.session.walletaddress;
    var pool=req.connection;
    var time=new Date();
    time = time.getUTCFullYear() + '-' +
        ('00' + (time.getMonth() + 1)).slice(-2) + '-' +
        ('00' + time.getDate()).slice(-2) + ' ' +
        ('00' + time.getHours()).slice(-2) + ':' +
        ('00' + time.getMinutes()).slice(-2) + ':' +
        ('00' + time.getSeconds()).slice(-2);
    //var nowbalance = 1000;
    var toExchange = req.body["toExchange"];
    //var limit = parseInt(nowbalance / 100);
    var address = process.env.PLATFORM_ADDR;
    var privkey = Buffer.from(process.env.PRIV_KEY, "hex");
    var count = web3.eth.getTransactionCount(address);
    var data = pointcontract.operatorMint.getData(toaddress, toExchange, "0x", "0x", {
        from: address,
    });
    var gasPrice = 0;
    var gasLimit = 3000000;
    var rawTx = {
        from: address,
        nonce: web3.toHex(count),
        gasPrice: web3.toHex(gasPrice),
        gasLimit: web3.toHex(gasLimit),
        to: pointAddress,
        value: 0x0,
        data: data,
        chainId: 13330,
    };
    var tx = new Tx(rawTx, { common: customCommon });
    tx.sign(privkey);
    var serializedTx = tx.serialize();
    var hash = web3.eth.sendRawTransaction("0x" + serializedTx.toString("hex"));
    console.log(hash);
    var exchangeInfo='平台幣兌換';
    var balance = pointcontract.balanceOf(req.session.walletaddress).toNumber();
    balance=balance+parseInt(toExchange);
    pool.getConnection(function(err,connection){
        connection.query('INSERT INTO point_transactions(time,address,hash,change_amount,balance,info) VALUES(?,?,?,?,?,?)',[time,toaddress,hash,toExchange,balance,exchangeInfo],function(err,rows){
            if(err){
                console.log(err)
            }else{
                res.render("personal/exchange_redirect");
            }
        })
        connection.release();
    })
});
module.exports = router;