var express = require("express");
var router = express.Router();
var Tx = require("ethereumjs-tx").Transaction;
var Web3 = require("web3");
const web3 = new Web3();
var Common = require("ethereumjs-common").default;
web3.setProvider(
  new web3.providers.HttpProvider(
    "https://besu-nft-f1da896e4e-node-f6ee1078.baas.twcc.ai"
  )
);
var vendorAddress = "0x749cc91223ECe3E2F533eA52760A9D3072da2165";
var vendorabi = require("../vendorABI");
var vendorabi = vendorabi.vendorABI;
var vendorcontract = web3.eth.contract(vendorabi).at(vendorAddress);
var collectionabi = require("../collectionABI");
var collectionabi = collectionabi.collectionABI;
const customCommon = Common.forCustomChain(
  "mainnet",
  {
    name: "nft",
    chainId: 13144,
    networkId: 13144,
  },
  "petersburg"
);
router.get("/", function (req, res) {
  var pool = req.connection;
  var works = new Array();
  var user = req.session.walletaddress;
  pool.getConnection(function (err, connection) {
    connection.query(
      "SELECT contract FROM collectionlist ",
      function (err, rows) {
        // if(err){
        //     console.log(err)
        // }
        // for(var i=0;i<rows.length;i++){
        //     var contract=web3.eth.contract(collectionabi).at(rows[i].contract);
        //     var total=contract.totalSupply.call().toNumber();
        //     var author=contract.author.call();
        //     for(var id=1;id<=total;id++){
        //         var owner=contract.ownerOf.call(id);
        //         if(owner==author&&owner!=user){
        //             var uri=contract.tokenURI(id);
        //             works.push([uri,rows[i].contract,id]);
        //         }
        //     }
        // }
        res.render("explore/explore", {
          email: req.session.email,
          role: req.session.role,
          works: works,
          explore: explore,
        });
      }
    );
    connection.release();
  });
});
router.post("/", function (req, res) {
  // var tokenaddress=req.body['contractaddress'];
  // var tokenid=req.body['tokenid'];
  // var buyer = req.session.walletaddress;
  // var address = req.session.walletaddress;
  // var privkey = Buffer.from(req.session.pk, 'hex');
  // var data = vendorcontract.buy.getData(buyer,2,tokenaddress,tokenid);
  // var count = web3.eth.getTransactionCount(address);
  // var gasPrice = web3.eth.gasPrice.toNumber() * 2;
  // var gasLimit = 3000000;
  // var rawTx = {
  //     "from": address,
  //     "nonce": web3.toHex(count),
  //     "gasPrice": web3.toHex(gasPrice),
  //     "gasLimit": web3.toHex(gasLimit),
  //     "to": vendorAddress,
  //     "value": 0x0,
  //     "data": data,
  //     "chainId": 13144
  // }
  // var tx = new Tx(rawTx, { common: customCommon });
  // tx.sign(privkey);
  // var serializedTx = tx.serialize();
  // var hash = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
  // console.log(hash)
  // res.render('explore/buy_redirect');

  res.render("explore/explore_detail");
});
module.exports = router;

var explore = [
  {
    uri: "https://dummyimage.com/350x350/8b9091/fff",
    collection: "DouJiang",
    creater: "kanko",
    title: "yummy",
    price: 2,
  },
  {
    uri: "https://dummyimage.com/350x350/8b9091/fff",
    collection: "Y-find",
    creater: "Rochester",
    title: "Manouria emys",
    price: 2,
  },
  {
    uri: "https://dummyimage.com/350x350/8b9091/fff",
    collection: "Alpha",
    creater: "Brien",
    title: "Lasiodora parahybana",
    price: 2,
  },
  {
    uri: "https://dummyimage.com/350x350/8b9091/fff",
    collection: "Biodex",
    creater: "Herve",
    title: "Crocodylus niloticus",
    price: 2,
  },
  {
    uri: "https://dummyimage.com/350x350/8b9091/fff",
    collection: "Konklux",
    creater: "Nomi",
    title: "Ephipplorhynchus senegalensis",
    price: 2,
  },
  {
    uri: "https://dummyimage.com/350x350/8b9091/fff",
    collection: "Sonair",
    creater: "Glyn",
    title: "Mycteria leucocephala",
    price: 2,
  },
  {
    uri: "https://dummyimage.com/350x350/8b9091/fff",
    collection: "Namfix",
    creater: "Dionysus",
    title: "Coluber constrictor",
    price: 2,
  },
];
