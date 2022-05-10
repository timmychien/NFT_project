var express = require("express");
var router = express.Router();
var Web3 = require('web3');
const web3 = new Web3();
var Common = require('ethereumjs-common').default;
web3.setProvider(new web3.providers.HttpProvider("https://besu-nftproject-8e16194c11-node-0d55c2a5.baas.twcc.ai"));
var pointabi = require('./pointABI');
var pointabi = pointabi.pointABI;
var pointAddress = "0x1e8B628Da1EBcE9B1adA7CD181cda91614762414";
var pointcontract = web3.eth.contract(pointabi).at(pointAddress);
var collectionabi = require("./collectionABI");
var collectionabi = collectionabi.collectionABI;
/* GET home page. */
router.get("/", function (req, res) {
  var pool = req.connection;
  if (req.session.email) {
    var bal = pointcontract.balanceOf(req.session.walletaddress).toNumber();
  }
   pool.getConnection(function(err,connection){
     connection.query('SELECT * FROM art_works WHERE promote=1',function(err,rows){
       if (err) {
         res.render('error', {
           message: err.message,
           error: err
        })
       }else{
         var promote_data = rows;
         var collections=new Array();
           connection.query(
             "SELECT * FROM goods_onsell ",
             function (err, rows) {
               if (err) {
                 console.log(err);
               }
               var new_arrival=rows;
               res.render('index', {
                 title: 'Home',
                 bal: bal,
                 promote_data: promote_data,
                 email: req.session.email,
                 new_arrival: new_arrival,
                 activity_detail: activity_detail,
                 role: req.session.role,
                 walletaddress: req.session.walletaddress
               });
             });
       }
     })
     connection.release();
   })
});

module.exports = router;
/*
var new_arrival = [
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
];*/

var activity_detail = [
  {
    uri: "http://dummyimage.com/350x350.png/ff4444/ffffff",
    status: "正在進行",
    date: "04/03/2021 - 08/17/2021",
    title: "Destinées, Les",
  },
  {
    uri: "http://dummyimage.com/350x350.png/5fa2dd/ffffff",
    status: "即將來臨",
    date: "08/17/2021 - 04/23/2022",
    title: "Oblivion Islando",
  },
  {
    uri: "http://dummyimage.com/350x350.png/ff4444/ffffff",
    status: "即將來臨",
    date: "04/23/2022 - 07/23/2022",
    title: "A Summer in La Goulette",
  },
  {
    uri: "http://dummyimage.com/350x350.png/ff4444/ffffff",
    status: "正在進行",
    date: "06/19/2021 - 07/23/2022",
    title: "Born to Defense",
  },
  {
    uri: "http://dummyimage.com/350x350.png/dddddd/000000",
    status: "正在進行",
    date: "06/19/2021 - 04/09/2022",
    title: "Fun and Fancy Free",
  },
  {
    uri: "http://dummyimage.com/350x350.png/dddddd/000000",
    status: "正在進行",
    date: "04/09/2022 - 04/09/2022",
    title: "Angels and Insects",
  },
];
