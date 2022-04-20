var express = require("express");
var router = express.Router();
var ethWallet = require("ethereumjs-wallet");
var nodemailer = require("nodemailer");
require("dotenv").config();
/* GET home page. */
router.get("/", function (req, res) {
  res.render("sign/sign", {
    title: "註冊",
    session: req.session.email,
  });
});
router.post("/", function (req, res) {
  var email = req.body["email"];
  var userpass = req.body["userpass"];
  var passcheck = req.body["passcheck"];
  var name = req.body["name"];
  //var cellphone=req.body['cellphone'];
  //var homeaddress=req.body['homeaddress'];
  var pool = req.connection;
  pool.getConnection(function (err, connection) {
    connection.query(
      "SELECT email FROM member_info WHERE email=?",
      [email],
      function (err, rows) {
        if (err) {
          res.render("error", {
            message: err.message,
            error: err,
          });
        }
        if (rows.length >= 1) {
          res.render("sign/sign", { warn: "此信箱已被註冊" });
        }
        if (userpass != passcheck) {
          res.render("sign/sign", { passWarn: "密碼不一致，請重新輸入" });
        } else {
          let addressData = ethWallet["default"].generate();
          var pk = addressData.getPrivateKeyString().replace("0x", "");
          var address = addressData.getAddressString();
          var verified = 0;
          var code = Math.floor(Math.random() * (999999 - 111111) + 111111);
          connection.query(
            "INSERT INTO member_info(email,Name,password,role,isverified,privkey,address,votecount,verifycode)VALUES(?,?,?,?,?,?,?,?,?)",
            [email, name, userpass, "member", verified, pk, address, 0, code],
            function (err, rows) {
              if (err) {
                res.redirect("/sign");
                console.log(err);
              } else {
                req.session.email = email;
                req.session.walletaddress = address;
                req.session.isverified = 0;
                console.log("insert success");
                var transporter = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASS,
                  },
                });
                var mailOptions = {
                  from: "nftplatform<process.env.EMAIL>",
                  to: email,
                  subject: "帳號驗證碼",
                  text: "驗證碼為:" + code.toString(),
                };
                transporter.sendMail(mailOptions, function (err, info) {
                  if (err) {
                    console.log(err);
                  } else {
                    //console.log('send success:' + info.response)
                    res.redirect("/emailverify");
                  }
                });
                //res.render('sign_redirect',{pk:pk});
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
