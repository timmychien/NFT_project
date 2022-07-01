var express = require('express');
var router = express.Router();
var Tx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nftproject-8e16194c11-node-0d55c2a5.baas.twcc.ai"));
var vendorAddress = "0x78931Ab7795710473556F35ee546E105ec4B3c01";
var vendorabi = require('../vendorABI');
var vendorabi = vendorabi.vendorABI;
var pointabi = require('../pointABI');
var pointabi = pointabi.pointABI;
var pointAddress = "0x1e8B628Da1EBcE9B1adA7CD181cda91614762414";
var pointcontract = web3.eth.contract(pointabi).at(pointAddress);
var collectionabi=require('../collectionABI');
var collectionabi=collectionabi.collectionABI;
var abi = require('../collectionABI');
var abi = abi.collectionABI;
var vendorcontract = web3.eth.contract(vendorabi).at(vendorAddress);
const customCommon = Common.forCustomChain('mainnet', {
    name: 'nftproject',
    chainId: 13330,
    networkId: 13330

}, 'petersburg')
router.get('/', function (req, res) {
    if (!req.session.email) {
        res.redirect('/login')
    }
    else{
        var contracts = new Array();
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
                        var contractaddress=contracts[idx];
                        var contract = web3.eth.contract(abi).at(contractaddress);
                        var idlist = contract.tokenIdofOwnerByAddress.call(owner);
                        var ids=new Array();
                        for (var j = 0; j < idlist.length; j++) {
                            if (vendorcontract.onSell.call(contracts[idx],idlist[j])==false){
                                ids.push(idlist[j]);
                            }
                        }
                        for (var id = 0; id < ids.length; id++) {
                            var uri = contract.tokenURI.call(ids[id]);
                            var metadata = contract.MetaData.call(ids[id]);
                            var name = metadata[1];
                            works.push([uri, contracts[idx], name, ids[id]]);
                        }
                    }
                    const numOfResults = works.length;
                    const resultsPerPage = 9;
                    const numOfPages = Math.ceil(numOfResults / resultsPerPage);
                    let page = req.query.page ? parseInt(req.query.page) : 1;
                    const startIndex = (page - 1) * resultsPerPage;
                    const endIndex = page * resultsPerPage;

                    if (endIndex > works.length - 1) {
                        worksPerPage = works.slice(startIndex);
                    } else {
                        worksPerPage = works.slice(startIndex, endIndex);
                    }
                    let pagination = {
                        numOfPages: Array(numOfPages),
                        page: page,
                    };

                    if (endIndex < works.length) {
                        pagination.next = "?page=" + (page + 1).toString();
                    }

                    if (startIndex > 0) {
                        pagination.previous = "?page=" + (page - 1).toString();
                    }
                    res.render('resell/resell', {
                        title: '我的藝術品',
                        email: req.session.email,
                        role: req.session.role,
                        bal: bal,
                        walletaddress: req.session.walletaddress,
                        upgrade: req.session.upgrade,
                        works: works,
                        pagination: pagination,
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
    console.log(name)
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
        "chainId": 13330
    }
    var tx = new Tx(rawTx, { common: customCommon });
    tx.sign(privkey);
    var serializedTx = tx.serialize();
    var hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
    console.log(hash)
    setTimeout(function () {
        res.redirect('/resell/' + nftaddress + '/' +tokenId+'/'+name+'/'+newPrice);
    },5000)
   
})
router.get('/:address/:id/:name/:price',function(req,res){
    var bal = pointcontract.balanceOf.call(req.session.walletaddress).toNumber();
    res.render('resell/resell_redirect',{
        email: req.session.email,
        role: req.session.role,
        upgrade: req.session.upgrade,
        bal: bal,
    })
})
router.post('/:address/:id/:name/:price',function(req,res){
    var time = new Date();
    time = time.getUTCFullYear() + '-' +
        ('00' + (time.getMonth() + 1)).slice(-2) + '-' +
        ('00' + time.getDate()).slice(-2) + ' ' +
        ('00' + time.getHours()).slice(-2) + ':' +
        ('00' + time.getMinutes()).slice(-2) + ':' +
        ('00' + time.getSeconds()).slice(-2);
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
        "chainId": 13330
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
                connection.query("INSERT INTO nft_transaction(txhash,contractAddress,tokenId,actor,info,time)VALUES(?,?,?,?,?,?)", [hash, nftaddress, tokenId, req.session.name, "上架", time], function (err, rows) {
                    if(err){
                        console.log(err)
                    }else{
                        res.render('resell/resell_success_redirect');
                    }
                });
                //res.redirect('/');
            }
        })
        connection.release();
    })
    
})
router.get('/work_detail/:contractaddress/:tokenid',function(req,res){
    if (!req.session.email) {
        var bal = 0;
    } else {
        var bal = pointcontract.balanceOf.call(req.session.walletaddress).toNumber();
    }
    var pool = req.connection;
    var contractaddress = req.params.contractaddress;
    var tokenId = req.params.tokenid;
    var contract = web3.eth.contract(collectionabi).at(contractaddress);
    var creator = contract.author.call();
    //var owner = contract.ownerOf.call(tokenId);
    var uri = contract.tokenURI(tokenId);
    pool.getConnection(function (err, connection) {
        var metadata = contract.MetaData.call(tokenId);
        var name = metadata[1];
        var description = metadata[2];
        var price = metadata[3];
        connection.query('SELECT * FROM nft_transaction WHERE contractAddress=?AND tokenId=?ORDER BY time DESC',[contractaddress,tokenId],function(err,rows1){
            if(err){
                console.log(err)
            }else{
                var transactions=rows1;
                connection.query('SELECT * FROM member_info WHERE address=?', [creator], function (err, rows2) {
                    if (err) {
                        console.log(err)
                    } else {
                        var creatorname = rows2[0].Name;
                        res.render("resell/work_detail", {
                            title: "nft_detail",
                            bal: bal,
                            upgrade: req.session.upgrade,
                            role:req.session.role,
                            email: req.session.email,
                            name: name,
                            description: description,
                            price: price,
                            creator: creatorname,
                            uri: uri,
                            tokenid: tokenId,
                            contractaddress: contractaddress,
                            creator: creatorname,
                            transactions:transactions
                        });
                    }
                })
            }
        })
        connection.release();
        
    })
})
module.exports = router;