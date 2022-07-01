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
var vendorAddress = "0x78931Ab7795710473556F35ee546E105ec4B3c01";
var vendorabi = require('../vendorABI');
var vendorabi = vendorabi.vendorABI;
var vendorcontract = web3.eth.contract(vendorabi).at(vendorAddress);
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
    var creator=contract.author.call();
    var owner = contract.ownerOf.call(tokenId);
    console.log(owner)
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
                    }
                    if(rows.length==0){
                        
                    } 
                    else {
                        if (!req.session.email) {
                            res.redirect('/explore_detail_disabled/' + contractaddress + '/' + tokenId);
                        }
                        else{
                            var ownername = rows[0].Name;
                            connection.query('SELECT * FROM member_info WHERE address=?', [creator], function (err, rows) {
                                var creatorname = rows[0].Name;
                                if (owner == req.session.walletaddress) {
                                    res.redirect('/explore_detail_disabled/' + contractaddress + '/' + tokenId);
                                } else {
                                    res.render("explore/explore_detail", {
                                        title: "nft_detail",
                                        bal: bal,
                                        role: req.session.role,
                                        email: req.session.email,
                                        name: name,
                                        description: description,
                                        price: price,
                                        creator: creatorname,
                                        uri: uri,
                                        tokenid: tokenId,
                                        contractaddress: contractaddress,
                                        owner: ownername,
                                        owneraddress: owner,
                                        transactions: transactions
                                    });
                                }
                            });
                        }
                    }
                })
            }
        });
        connection.release();
    })

});
router.post('/:contractaddress/:tokenid',function(req,res){
    var contractaddress = req.params.contractaddress;
    var tokenid = req.params.tokenid;
    var price = req.body['price'];
    var bal = pointcontract.balanceOf.call(req.session.walletaddress).toNumber();
    if (bal < price) {
        res.render('explore/explore_detail', {
            warn: '您的點數餘額不足!'
        })
    }
    else{
        res.render('explore/buy_confirm', {
            contractaddress: contractaddress,
            tokenid: tokenid,
            price: price
        });
    }
})
router.post('/:contractaddress/:tokenid/:price/confirm', function (req, res) {
    var bal = pointcontract.balanceOf.call(req.session.walletaddress).toNumber();
    var tokenaddress = req.params.contractaddress;
    var tokenid = req.params.tokenid;
    var price=req.params.price;
    var pool = req.connection;
    var time = new Date();
    time = time.getUTCFullYear() + '-' +
        ('00' + (time.getMonth() + 1)).slice(-2) + '-' +
        ('00' + time.getDate()).slice(-2) + ' ' +
        ('00' + time.getHours()).slice(-2) + ':' +
        ('00' + time.getMinutes()).slice(-2) + ':' +
        ('00' + time.getSeconds()).slice(-2);    
    var tokencontract = web3.eth.contract(collectionabi).at(tokenaddress);
    var name = tokencontract.name.call();
    var tokenowner = tokencontract.ownerOf.call(tokenid);
    var buyer = req.session.walletaddress;
    var address = req.session.walletaddress;
    var privkey = Buffer.from(req.session.pk, 'hex');
    var data = vendorcontract.buy.getData(buyer, price, tokenaddress, tokenid);
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
    pool.getConnection(function (err, connection) {
        connection.query('DELETE FROM goods_onsell WHERE contract=? AND tokenid=?', [tokenaddress, tokenid], function (err, rows) {
            if (err) {
                console.log(err)
            } else {
                var buyer_bal = pointcontract.balanceOf.call(req.session.walletaddress).toNumber();
                buyer_bal=buyer_bal-price;
                var seller_bal = pointcontract.balanceOf.call(tokenowner).toNumber();
                seller_bal=seller_bal+parseInt(price);
                var buy_change=-price;
                var sell_change=+price;
                var buy_info='購買NFT:'+name+'(id:'+tokenid+')';
                var sell_info = '販售NFT:' + name + '(id:' + tokenid + ')';
                connection.query('INSERT INTO point_transactions(time,address,hash,change_amount,balance,info)VALUES(?,?,?,?,?,?),(?,?,?,?,?,?)',[time,tokenowner,hash,sell_change,seller_bal,sell_info,time,buyer,hash,buy_change,buyer_bal,buy_info],function(err,rows){
                    if(err){
                        console.log(err)
                    }else{
                        connection.query("INSERT INTO nft_transaction(txhash,contractAddress,tokenId,actor,info,time)VALUES(?,?,?,?,?,?)", [hash, tokenaddress, tokenid, req.session.name, "購買", time], function (err, rows) {
                            res.render('explore/buy_redirect');
                        })
                        
                    }
                })
                    
            }
        })
        connection.release();
    })
    //res.render('explore/buy_redirect');
    
})

module.exports = router;