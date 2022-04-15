var express = require("express");
var router = express.Router();
var Tx = require("ethereumjs-tx").Transaction;
var Web3 = require("web3");
var Common = require("ethereumjs-common").default;
const web3 = new Web3();
web3.setProvider(
  new web3.providers.HttpProvider(
    "https://besu-nft-f1da896e4e-node-f6ee1078.baas.twcc.ai"
  )
);
var abi = require("../pointABI");
var abi = abi.pointABI;
var pointAddress = "0x3321432994311cf7ee752971C8A8D67dF357fa43";
var contract = web3.eth.contract(abi).at(pointAddress);
const customCommon = Common.forCustomChain(
  "mainnet",
  {
    name: "nft",
    chainId: 13144,
    networkId: 13144,
  },
  "petersburg"
);
/* GET home page. */
router.get("/", function (req, res) {
  if (!req.session.email) {
    res.redirect("/login");
  }
  if (req.session.isverified == 0) {
    console.log("need verify");
    res.redirect("/verify");
  }
  res.render("personal/exchangetoken", {
    title: "兌換代幣",
    walletaddress: req.session.walletaddress,
    email: req.session.email,
    role: req.session.role,
  });
});
router.post("/", function (req, res) {
  var toaddress = req.session.walletaddress;
  var nowbalance = 1000;
  var tochange = req.body["tochange"];
  var limit = parseInt(nowbalance / 100);
  if (tochange > limit) {
    res.render("personal/not_enough_point");
  } else {
    var address = process.env.PLATFORM_ADDR;
    var privkey = Buffer.from(process.env.PRIV_KEY, "hex");
    var count = web3.eth.getTransactionCount(address);
    var data = contract.operatorMint.getData(toaddress, tochange, "0x", "0x", {
      from: address,
    });
    var gasPrice = 0;
    var gasLimit = 3000000;
    var rawTx = {
      from: address,
      nonce: web3.toHex(count),
      gasPrice: web3.toHex(gasPrice),
      gasLimit: web3.toHex(gasLimit),
      to: pointAddress,
      value: 0x0,
      data: data,
      chainId: 13144,
    };
    var tx = new Tx(rawTx, { common: customCommon });
    tx.sign(privkey);
    var serializedTx = tx.serialize();
    var hash = web3.eth.sendRawTransaction("0x" + serializedTx.toString("hex"));
    console.log(hash);
    res.render("personal/exchange_redirect", {
      hash: "https://rinkeby.etherscan.io/tx/" + hash,
    });
  }
});

module.exports = router;
