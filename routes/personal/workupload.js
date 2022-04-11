var express = require("express");
var router = express.Router();
require("dotenv").config();
/* GET home page. */
router.get("/", function (req, res) {
  if (!req.session.email) {
    res.redirect("/login");
  }
  if (req.session.isverified == 0) {
    console.log("need verify");
    res.redirect("/verify");
  }
  res.render("personal/workupload", {
    title: "作品上傳",
    email: req.session.email,
    role: req.session.role,
    goods: goods,
    collections: collections,
  });
});
router.post("/", function (req, res) {
  //res.send(req.file)
  var author = req.session.name;
  var authoraddress = req.session.walletaddress;
  var name = req.body["name"];
  var symbol = req.body["symbol"];
  var uri = req.body["ipfsuri"];
  console.log(uri);
  var pool = req.connection;
  pool.getConnection(function (err, connection) {
    connection.query(
      "SELECT * FROM art_works WHERE name=? AND,symbol=?",
      [name, symbol],
      function (err, rows) {
        if (err) {
          console.log(err);
        }
        if (rows == 1) {
          res.render("personal/workupload", {
            warn: "此名稱與代號已被使用！",
          });
        } else {
          connection.query(
            "INSERT INTO art_works (votingId,participantId,name,symbol,author,uri,authoraddress,available,promote)VALUES(?,?,?,?,?,?,?,?,?)",
            [0, 0, name, symbol, author, uri, authoraddress, 0, 0],
            function (err, rows) {
              if (err) {
                console.log(err);
              } else {
                console.log("upload success");
                res.render("personal/workupload_redirect", {
                  uri: uri,
                });
              }
            }
          );
        }
      }
    );
    connection.release();
  });
});
module.exports = router;

var goods = [
  {
    uri: "https://dummyimage.com/350x350/8b9091/fff",
    collection: "DouJiang",
  },
  {
    uri: "https://dummyimage.com/350x350/8b9091/fff",
    collection: "Y-find",
  },
];

var collections = [
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
