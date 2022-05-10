var express=require('express');
var router=express.Router();
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nftproject-8e16194c11-node-0d55c2a5.baas.twcc.ai"));
var pointabi = require('../pointABI');
var pointabi = pointabi.pointABI;
var pointAddress = "0x1e8B628Da1EBcE9B1adA7CD181cda91614762414";
var pointcontract = web3.eth.contract(pointabi).at(pointAddress);
router.get('/',function(req,res){
    if (!req.session.email) {
        res.redirect('/login');
    } else {
        var bal = pointcontract.balanceOf(req.session.walletaddress).toNumber();
        res.render('personal/mywallet', {
            email: req.session.email,
            role: req.session.role,
            bal: bal
        })
    }
})
module.exports=router;