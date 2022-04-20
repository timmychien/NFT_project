var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
require("dotenv").config();
router.get("/", function (req, res) {
  res.render("forgetpw/forgetpw", {
    email: req.session.email,
    role: req.session.role,
  });
});
router.post("/", function (req, res) {
  var email = req.body["email"];
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
        if (rows.length == 0) {
          res.render("forgetpw/forgetpw", { warn: "此信箱尚未被註冊" });
        } else {
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
            subject: "重置密碼通知",
            html: '<p>您好!</p><br/><p>請點擊以下連結重置密碼</p><br/><a href="http://localhost:3200/resetpw/">點我重置密碼</a>',
          };
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
              console.log(err);
            } else {
              //console.log('send success:' + info.response)
              res.render("forgetpw/forgetpw_redirect", {
                email: email,
              });
            }
          });
        }
      }
    );
    connection.release();
  });
});
module.exports = router;
