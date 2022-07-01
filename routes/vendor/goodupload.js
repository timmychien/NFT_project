var express = require("express");
var router = express.Router();
//require("dotenv").config();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nftproject-8e16194c11-node-0d55c2a5.baas.twcc.ai"));
var vendorAddress = "0x78931Ab7795710473556F35ee546E105ec4B3c01";
var abi = require('../vendorABI');
var abi = abi.vendorABI;
var pointabi = require('../pointABI');
var pointabi = pointabi.pointABI;
var pointAddress = "0x1e8B628Da1EBcE9B1adA7CD181cda91614762414";
var pointcontract = web3.eth.contract(pointabi).at(pointAddress);
var contract = web3.eth.contract(abi).at(vendorAddress);
var collectionabi = require('../collectionABI');
var collectionabi = collectionabi.collectionABI;
const customCommon = Common.forCustomChain('mainnet', {
    name: 'nftproject',
    chainId: 13330,
    networkId: 13330

}, 'petersburg')
/* GET home page. */
router.get('/', function (req, res) {
    var pool = req.connection;
    if (!req.session.email) {
        res.redirect('/login');
    }
    else {
        var vendor = req.session.walletaddress;
        var bal = pointcontract.balanceOf(req.session.walletaddress).toNumber();
        pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM collectionlist WHERE vendor=?', [vendor], function (err, rows) {
                if (err) {
                    console.log(err)
                }
                else {
                    var collections = rows;
                    res.render('vendor/goodupload', {
                        title: '我的商品集',
                        email: req.session.email,
                        role: req.session.role,
                        upgrade: req.session.upgrade,
                        bal:bal,
                        collections: collections
                    })
                }

            });
            connection.release();
        })

    }

});
router.post("/", function (req, res) {
    var pool = req.connection;
    var name = req.body['name'];
    var symbol = req.body['symbol'];
    var description=req.body['description'];
    var uri=req.body['ipfsuri'];
    if(uri==''){
        res.render('vendor/error_notice', {
            warn: '尚未上傳圖片或圖片上傳未成功'
        })
    }
    else if(name==''){
        res.render('vendor/error_notice', {
            warn: '尚未輸入商品集名稱'
        })
    }
    else if (symbol == '') {
        res.render('vendor/error_notice', {
            warn: '尚未輸入商品集代號'
        })
    }
    else{
        console.log(uri)
        pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM collectionlist WHERE name=?', [name], function (err, rows) {
                if (err) {
                    console.log(err)
                } else {
                    if (rows.length > 0) {
                        res.render('vendor/goodupload_error');
                    } else {
                        var address = req.session.walletaddress;
                        var vendor = req.session.walletaddress;
                        var vendorname = req.session.name;
                        var privkey = Buffer.from(req.session.pk, 'hex');
                        var data = contract.createNFT.getData(name, symbol, vendor);
                        var count = web3.eth.getTransactionCount(address);
                        var gasPrice = 0;
                        var gasLimit = 3000000;
                        var rawTx = {
                            "from": address,
                            "nonce": web3.toHex(count),
                            "gasPrice": web3.toHex(gasPrice),
                            "gasLimit": web3.toHex(gasLimit),
                            "to": vendorAddress,
                            "value": 0x0,
                            "data": data,
                            "chainId": 13330
                        }
                        var tx = new Tx(rawTx, { common: customCommon });
                        tx.sign(privkey);
                        var serializedTx = tx.serialize();
                        var hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
                        console.log(hash)
                        //var nftaddress = contract.getaddress.call(vendor, name);
                        //console.log(nftaddress)
                        setTimeout(function () {
                            var nftaddress = contract.getaddress.call(vendor, name);
                            console.log(nftaddress)
                            connection.query('INSERT INTO collectionlist(name,symbol,vendor,contract,description,uri,vendorname)VALUES(?,?,?,?,?,?,?)', [name, symbol, vendor, nftaddress, description, uri, vendorname], function (err, rows) {
                                if (err) {
                                    res.render('error', {
                                        message: err.message,
                                        error: err
                                    })
                                } else {
                                    res.render('vendor/add_redirect');
                                }
                            })
                            connection.release()
                        }, 15000)
                    }
                }
            })
            connection.release();
        })
    //var nftaddress=req.body['addr'];
    }
});
router.post("/workupload", function (req, res) {
    var time = new Date();
    time = time.getUTCFullYear() + '-' +
        ('00' + (time.getMonth() + 1)).slice(-2) + '-' +
        ('00' + time.getDate()).slice(-2) + ' ' +
        ('00' + time.getHours()).slice(-2) + ':' +
        ('00' + time.getMinutes()).slice(-2) + ':' +
        ('00' + time.getSeconds()).slice(-2);
    var pool = req.connection;
    var collection = req.body["work_belong_collection"];
    var ipfsuri = req.body['work_ipfsuri'];
    var name = req.body['work_name'];
    var description = req.body['work_description'];
    var price = req.body['work_price'];
    var vendor = req.session.walletaddress;
    var address = req.session.walletaddress;
    var privkey = Buffer.from(req.session.pk, "hex");
    if(ipfsuri==''){
        res.render('vendor/error_notice',{
            warn:'尚未上傳圖片或圖片上傳未成功'
        })
    }
    else if (name == '') {
        res.render('vendor/error_notice', {
            warn: '尚未輸入商品集名稱'
        })
    }
    else if (price == '') {
        res.render('vendor/error_notice', {
            warn: '尚未輸入價格'
        })
    }
    else {
    console.log(ipfsuri);
    pool.getConnection(function(err,connection){
        connection.query('SELECT contract FROM collectionlist WHERE name=?',[collection],function(err,rows){
            if(err){
                console.log(err)
            }else{
                var tokenaddress=rows[0].contract;
                console.log(tokenaddress);
                var collectioncontract = web3.eth.contract(collectionabi).at(tokenaddress);
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
                    "chainId": 13330
                }
                var tx = new Tx(rawTx, { common: customCommon });
                tx.sign(privkey);
                var serializedTx = tx.serialize();
                var hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
                console.log(hash)
                setTimeout(function () {
                    var tokenId = collectioncontract.balanceOf.call(vendor).toNumber();
                    console.log(tokenId);
                        connection.query("INSERT INTO goods_onsell(contract,tokenid,name,tokenURI,price)VALUES(?,?,?,?,?)", [tokenaddress, tokenId, name, ipfsuri, price], function (err, rows) {
                            if (err) {
                                console.log(err)
                            } else {
                                connection.query("INSERT INTO nft_transaction(txhash,contractAddress,tokenId,actor,info,time)VALUES(?,?,?,?,?,?)",[hash,tokenaddress,tokenId,req.session.name,"鑄造",time],function(err,rows){
                                    if(err){
                                        console.log(err)
                                    }else{
                                        res.render('vendor/list_redirect');
                                    }
                                })
                               
                            }

                        })
                        connection.release();
                }, 10000)
            }
        })
        connection.release();
    })
    }
    
});
module.exports = router;