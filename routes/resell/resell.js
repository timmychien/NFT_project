var express = require('express');
var router = express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nftproject-8e16194c11-node-0d55c2a5.baas.twcc.ai"));
var vendorAddress = "0x7fDd60Cb32A4Db94EFfFe1611c588695f6e9E65b";
var vendorabi = require('../vendorABI');
var vendorabi = vendorabi.vendorABI;
var pointabi = require('../pointABI');
var pointabi = pointabi.pointABI;
var pointAddress = "0x1e8B628Da1EBcE9B1adA7CD181cda91614762414";
var pointcontract = web3.eth.contract(pointabi).at(pointAddress);
var abi = require('../collectionABI');
var abi = abi.collectionABI;
var vendorcontract = web3.eth.contract(vendorabi).at(vendorAddress);
const customCommon = Common.forCustomChain('mainnet', {
    name: 'nftproject',
    chainId: 13330,
    networkId: 13330

}, 'petersburg')
var contracts = new Array();
router.get('/', function (req, res) {
    if (!req.session.email) {
        res.redirect('/login')
    }
    else{
        var bal = pointcontract.balanceOf.call(req.session.walletaddress).toNumber();
        var pool = req.connection;
        var owner = req.session.walletaddress;
        //console.log(owner)
        var works = new Array();
        pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM collectionlist', function (err, rows) {
                if (err) {
                    console.log(err)
                } else {
                    for (var i = 0; i < rows.length; i++) {
                        if (contracts.includes(rows[i].contract) == false) {
                            contracts.push(rows[i].contract);
                        }
                    }
                    //console.log(contracts)
                    for (var idx = 0; idx < contracts.length; idx++) {
                        var contract = web3.eth.contract(abi).at(contracts[idx]);
                        var idlist = contract.tokenIdofOwnerByAddress.call(owner);
                        var ids = new Array();
                        for (var j = 0; j < idlist.length; j++) {
                            if (vendorcontract.isOnSell.call(contracts[idx], idlist[j]) == false) {
                                ids.push(idlist[j].toNumber());
                            }
                        }


                        for (var id = 0; id < ids.length; id++) {
                            var uri = contract.tokenURI.call(ids[id]);
                            var metadata = contract.MetaData.call(ids[id]);
                            var name = metadata[1];
                            works.push([uri, contracts[idx], name, ids[id]]);
                        }
                    }
                    res.render('resell/resell', {
                        title: '我的藝術品',
                        email: req.session.email,
                        role: req.session.role,
                        bal: bal,
                        walletaddress: req.session.walletaddress,
                        works: works
                    });
                }
            })
            connection.release();
        })
    }
});
router.post('/',function(req,res){
    var nftaddress=req.body['nftaddress'];
    var tokenId=req.body['tokenId'];
    var name=req.body['tokenName'];
    var newPrice = parseInt(req.body['newPrice']);
    console.log(newPrice)
    if(typeof(newPrice)!='number'){
        res.render('resell/resell',{
            warn:'請輸入整數數字'
        })
    }
    var address=req.session.walletaddress;
    var contract = web3.eth.contract(abi).at(nftaddress)
    var privkey = Buffer.from(req.session.pk, 'hex');
    var data = contract.approve.getData(vendorAddress,tokenId);
    var count = web3.eth.getTransactionCount(address);
    var gasPrice = 0;
    var gasLimit = 3000000;
    var rawTx = {
        "from": address,
        "nonce": web3.toHex(count),
        "gasPrice": web3.toHex(gasPrice),
        "gasLimit": web3.toHex(gasLimit),
        "to": nftaddress,
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
        res.redirect('/resell/' + nftaddress + '/' + tokenId+'/'+newPrice);
    },5000)
   
})
router.get('/:address/:id/:/name:price',function(req,res){
    var bal = pointcontract.balanceOf.call(req.session.walletaddress).toNumber();
    res.render('resell/resell_redirect',{
        email: req.session.email,
        role: req.session.role,
        bal: bal,
    })
})
router.post('/:address/:id/:name/:price',function(req,res){
    var pool=req.connection;
    var nftaddress=req.params.address;
    var tokenId=req.params.id;
    var name=req.params.name;
    var price = req.params.price;
    var collectionabi=require('../collectionABI');
    var collectionabi=collectionabi.collectionABI;
    var collectioncontract = web3.eth.contract(collectionabi).at(nftaddress);
    var uri = collectioncontract.tokenURI.call(tokenId);
    //var newPrice=req.body['newPrice'];
    var address = req.session.walletaddress;
    var privkey = Buffer.from(req.session.pk, 'hex');
    var data = vendorcontract.relist.getData(nftaddress,tokenId,address,price);
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
        "chainId": 13144
    }
    var tx = new Tx(rawTx, { common: customCommon });
    tx.sign(privkey);
    var serializedTx = tx.serialize();
    var hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
    console.log(hash)
    pool.getConnection(function(err,connection){
        connection.query("INSERT INTO goods_onsell(contract,tokenid,name,tokenURI,price)VALUES(?,?,?,?,?)",[nftaddress,tokenId,name,uri,price],function(err,rows){
            if(err){
                console.log(err)
            }else{
                res.redirect('/');
            }
        })
        connection.release();
    })
    
})
module.exports = router;