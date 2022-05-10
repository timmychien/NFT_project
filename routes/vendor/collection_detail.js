var express = require("express");
var router = express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nftproject-8e16194c11-node-0d55c2a5.baas.twcc.ai"));
var abi = require('../collectionABI');
var abi = abi.collectionABI;
//var vendorabi = require('../vendorABI');
//var vendorabi = vendorabi.vendorABI;
//var vendorcontract = web3.eth.contract(vendorabi).at(vendorAddress);
var pointabi = require('../pointABI');
var pointabi = pointabi.pointABI;
var pointAddress = "0x1e8B628Da1EBcE9B1adA7CD181cda91614762414";
var pointcontract = web3.eth.contract(pointabi).at(pointAddress);
const customCommon = Common.forCustomChain('mainnet', {
    name: 'nftproject',
    chainId: 13330,
    networkId: 13330

}, 'petersburg')
/* GET home page. */
router.get("/:title/:contractaddress", function (req, res) {
    if (!req.session.email) {
        res.redirect("/login");
    }else{
        // workaround in local
        var contractaddress = req.params.contractaddress;
        console.log(contractaddress)
        var title = req.params.title;
        var pool = req.connection;
        var goods = new Array();
        var contract = web3.eth.contract(abi).at(contractaddress);
        var amount = contract.totalSupply().toNumber();
        var bal = pointcontract.balanceOf(req.session.walletaddress).toNumber();
        pool.getConnection(function (err, connection) {
            connection.query("SELECT * FROM collectionlist WHERE contract=?", [contractaddress], function (err, rows) {
                if (err) {
                    console.log(err)
                }
                //var collectionuri=rows[0].uri;
                //var col_description=rows[0].description;
                var collection_info = rows[0];
                
                for (var id = 1; id <= amount; id++) {
                    var tokenuri = contract.tokenURI.call(id);
                    var metadata = contract.MetaData.call(id);
                    var name = metadata[1];
                    var description = metadata[2];
                    //var price = metadata[3];
                    goods.push([tokenuri, name, description]);
                }
                res.render("vendor/collection_detail", {
                    //title: "商品集詳情",
                    email: req.session.email,
                    collection_info: collection_info,
                    //uri: collectionuri,
                    title: title,
                    //data:rows,
                    //col_description: col_description,
                    //description: description,
                    bal: bal,
                    goods: goods,
                });
            })
            //connection.release();
        })
    }
});

module.exports = router;