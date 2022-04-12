var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
  // workaround in local
  res.render("vendor/collection_detail", {
    title: "商品集詳情",
    email: req.session.email,
    goods: goods,
  });
});

router.post("/", function (req, res) {
  var tokenaddress = req.body["contractaddress"];
  var tokenid = req.body["tokenid"];
  var buyer = req.session.walletaddress;
  var address = req.session.walletaddress;
  var privkey = Buffer.from(req.session.pk, "hex");
  var data = vendorcontract.buy.getData(buyer, 2, tokenaddress, tokenid);
  var count = web3.eth.getTransactionCount(address);
  var gasPrice = web3.eth.gasPrice.toNumber() * 2;
  var gasLimit = 3000000;
  var rawTx = {
    from: address,
    nonce: web3.toHex(count),
    gasPrice: web3.toHex(gasPrice),
    gasLimit: web3.toHex(gasLimit),
    to: vendorAddress,
    value: 0x0,
    data: data,
    chainId: 13144,
  };
  var tx = new Tx(rawTx, { common: customCommon });
  tx.sign(privkey);
  var serializedTx = tx.serialize();
  var hash = web3.eth.sendRawTransaction("0x" + serializedTx.toString("hex"));
  console.log(hash);
  res.render("explore/buy_redirect");
});

module.exports = router;
var goods = [
  {
    uri: "https://dummyimage.com/350x350/8b9091/fff",
    collection: "DouJiang",
    title: "yummy",
  },
  {
    uri: "https://dummyimage.com/350x350/8b9091/fff",
    collection: "Y-find",
    title: "Manouria emys",
  },
  {
    uri: "https://dummyimage.com/350x350/8b9091/fff",
    collection: "Alpha",
    title: "Lasiodora parahybana",
  },
  {
    uri: "https://dummyimage.com/350x350/8b9091/fff",
    collection: "Biodex",
    title: "Crocodylus niloticus",
  },
];
