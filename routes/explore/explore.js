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
var vendorAddress = "0xd0bbD01cd1e0580dA43031D99f0864c087040C2E";
var vendorabi = require("../vendorABI");
var vendorabi = vendorabi.vendorABI;
var vendorcontract = web3.eth.contract(vendorabi).at(vendorAddress);
var collectionabi = require("../collectionABI");
var collectionabi = collectionabi.collectionABI;
var pointabi = require("../pointABI");
var pointabi = pointabi.pointABI;
var pointAddress = "0x3321432994311cf7ee752971C8A8D67dF357fa43";
var pointcontract = web3.eth.contract(pointabi).at(pointAddress);
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
  if (!req.session.email) {
    res.redirect("/login");
  } else {
    var bal = pointcontract.balanceOf(req.session.walletaddress).toNumber();
    var pool = req.connection;
    var works = new Array();
    var user = req.session.walletaddress;
    pool.getConnection(function (err, connection) {
      connection.query(
        "SELECT contract FROM collectionlist ",
        function (err, rows) {
          if (err) {
            console.log(err);
          }
          for (var i = 0; i < rows.length; i++) {
            var contract = web3.eth
              .contract(collectionabi)
              .at(rows[i].contract);
            var total = contract.totalSupply.call().toNumber();
            //var author=contract.author.call();
            for (var id = 1; id <= total; id++) {
              var owner = contract.ownerOf.call(id);
              var isonsell = vendorcontract.isOnSell
                .call(rows[i].contract, id)
                .toString();
              if (owner != user && isonsell == "true") {
                var uri = contract.tokenURI(id);
                var metadata = contract.Metadata.call(id);
                var name = metadata[1];
                var description = metadata[2];
                var price = metadata[3];
                works.push([
                  uri,
                  name,
                  rows[i].vendorname,
                  rows[i].contract,
                  description,
                  price,
                ]);
              }
            }
          }
          res.render("explore/explore", {
            email: req.session.email,
            bal: bal,
            role: req.session.role,
            works: works,
          });
        }
      );
      connection.release();
    });
  }
});
module.exports = router;
