var express = require('express');
var router = express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nftproject-8e16194c11-node-0d55c2a5.baas.twcc.ai"));
var pointabi = require('../pointABI');
var pointabi = pointabi.pointABI;
var pointAddress = "0x1e8B628Da1EBcE9B1adA7CD181cda91614762414";
var pointcontract = web3.eth.contract(pointabi).at(pointAddress);
//var vendorAddress = "0xAc79aC8B2EF6d54dc241038b993f0eDC45434e93";
//var vendorabi = require('../vendorABI');
//var vendorabi = vendorabi.vendorABI;
//var vendorcontract = web3.eth.contract(vendorabi).at(vendorAddress);
var collectionabi = require('../collectionABI');
var collectionabi = collectionabi.collectionABI;
const customCommon = Common.forCustomChain('mainnet', {
    name: 'nftproject',
    chainId: 13330,
    networkId: 13330

}, 'petersburg')
/* GET home page. */
router.get("/:contractaddress/:tokenid", function (req, res) {
    if (!req.session.email) {
        var bal=0;
    }else{
        var bal = pointcontract.balanceOf.call(req.session.walletaddress).toNumber();
    }
    var pool = req.connection;
    var contractaddress = req.params.contractaddress;
    var tokenId = req.params.tokenid;
    var contract = web3.eth.contract(collectionabi).at(contractaddress);
    var creator = contract.author.call();
    var owner = contract.ownerOf.call(tokenId);
    //var isonsell = vendorcontract.isOnSell.call(contractaddress, id).toString();
    var uri = contract.tokenURI(tokenId);
    pool.getConnection(function (err, connection) {
        var metadata = contract.MetaData.call(tokenId);
        var name = metadata[1];
        var description = metadata[2];
        var price = metadata[3];
        connection.query('SELECT * FROM nft_transaction WHERE contractAddress=?AND tokenId=?ORDER BY time DESC', [contractaddress, tokenId], function (err, rows1) {
            if(err){
                console.log(err)
            }else{
                var transactions=rows1;
                connection.query('SELECT * FROM member_info WHERE address=?', [owner], function (err, rows) {
                    if (err) {
                        console.log(err)
                    } else {
                        var ownername = rows[0].Name;
                        connection.query('SELECT * FROM member_info WHERE address=?', [creator], function (err, rows) {
                            var creatorname = rows[0].Name;
                            res.render("explore/explore_detail_disabled", {
                                title: "nft_detail",
                                bal: bal,
                                email: req.session.email,
                                upgrade: req.session.upgrade,
                                name: name,
                                description: description,
                                price: price,
                                creator: creatorname,
                                uri: uri,
                                tokenid: tokenId,
                                contractaddress: contractaddress,
                                owner: ownername,
                                transactions:transactions
                            });
                        });
                    }
                })
            }
        });
        connection.release();
    })
});
module.exports = router;