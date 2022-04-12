var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
  if (!req.session.email) {
    res.redirect("/login");
  }
  if (req.session.isverified == 0) {
    console.log("need verify");
    res.redirect("/verify");
  }
  res.render("personal/mycollection", {
    title: "我的收藏品",
    email: req.session.email,
    role: req.session.role,
    mycollections: mycollections,
  });
});

module.exports = router;

var mycollections = [
  {
    uri: "https://dummyimage.com/350x350/8b9091/fff",
    collection: "DouJiang",
    creater: "kanko",
    title: "yummy",
  },
  {
    uri: "https://dummyimage.com/350x350/8b9091/fff",
    collection: "Y-find",
    creater: "Rochester",
    title: "Manouria emys",
  },
  {
    uri: "https://dummyimage.com/350x350/8b9091/fff",
    collection: "Alpha",
    creater: "Brien",
    title: "Lasiodora parahybana",
  },
  {
    uri: "https://dummyimage.com/350x350/8b9091/fff",
    collection: "Biodex",
    creater: "Herve",
    title: "Crocodylus niloticus",
  },
  {
    uri: "https://dummyimage.com/350x350/8b9091/fff",
    collection: "Konklux",
    creater: "Nomi",
    title: "Ephipplorhynchus senegalensis",
  },
];
