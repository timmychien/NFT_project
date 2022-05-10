var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql=require('mysql2');
var session = require('express-session');
var cors=require('cors');
var nodemailer = require('nodemailer');
//router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signRouter = require('./routes/sign/sign');
var emailVerifyRouter =require('./routes/sign/emailverify');
var forgetpwRouter=require('./routes/forgetpw/forgetpw');
var resetpwRouter = require('./routes/forgetpw/resetpw');
var forgetpkRouter=require('./routes/forgetpk');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
//var verifyRouter = require('./routes/sign/verify');
//admin
var createVoteRouter = require('./routes/admin/createvote');
var airdropNFTRouter = require('./routes/admin/airdropNFT');
var workConfigRouter=require('./routes/admin/workconfig');
var promoteRouter=require('./routes/admin/promote');
var auditvendorRouter=require('./routes/admin/auditvendor');
var signupoverviewRouter =require('./routes/overview/signup_overview');
var voteoverviewRouter = require('./routes/overview/vote_overview');
var signupRouter =require('./routes/signup/signup');
var voteRouter=require('./routes/vote/vote');
//activities
var activityRouter = require('./routes/activity/activity');
var openactivityRouter = require('./routes/activity/activity_open');
var onvoteactivityRouter = require('./routes/activity/activity_onvote');
//explore
var exploreRouter =require('./routes/explore/explore');
var exploreDetailRouter = require("./routes/explore/explore_detail");
var exploreDetailDisabledRouter = require("./routes/explore/explore_detail_disabled");
//resell
var resellRouter=require('./routes/resell/resell');
//works
var worksRouter=require('./routes/works/works');
var buyRouter = require('./routes/works/buy');
var voteworkRouter =require('./routes/works/vote');
var workvotedRounter=require('./routes/works/workvoted');
var workboughtRouter=require('./routes/works/workbought')
//個人專區
var myinfoRouter=require('./routes/personal/myinfo');
var myworkRouter=require('./routes/personal/mywork');
var mycollectionRouter=require('./routes/personal/mycollection');
var myregistrationRouter=require('./routes/personal/myregistration');
var workuploadRouter=require('./routes/personal/workupload');
var exchangetokenRouter=require('./routes/personal/exchangetoken');
var transfertokenRouter=require('./routes/personal/transfertoken');
var mywalletRouter=require('./routes/personal/mywallet');
var modifyInfoRouter=require('./routes/modify/modifyinfo');
var applyforvendorRouter=require('./routes/apply/applyforvendor');
//vendor
var addCollectionRouter=require('./routes/vendor/addCollection');
var workListingRouter=require('./routes/vendor/workListing');
var vendorCollectionRouter=require('./routes/vendor/vendorCollection');
var gooduploadRouter = require("./routes/vendor/goodupload");
var uploadworkRouter=require('./routes/vendor/uploadwork');
var collectionDetailRouter = require("./routes/vendor/collection_detail");
var app = express();
require('dotenv').config();
var pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "user"
})
pool.getConnection(function(err){
  if(err){
    console.log('connection error');
    console.log(err)
    return;
  }
  console.log('connection success');
});
setInterval(function(){
  if (((parseInt(Date.now() / 1000) - 57600) % 86400 >= 0) && ((parseInt(Date.now() / 1000) - 57600) % 86400 <60)) {
    pool.getConnection(function (err, connection) {
      connection.query('UPDATE  member_info SET votecount=0', function (err, rows) {
        if (err) {
          console.log(err)
        } else {
          console.log('votecount reset');
        }
      })
      connection.release();
      var now = parseInt(Date.now() / 1000);
      connection.query('SELECT * from voting',function(err,rows_1){
        if (err) {
          console.log(err)
          //return;
        } else {
          for(var i=0;i<rows_1.length;i++){
            if(now>=rows_1[i].startVotestamp){
              connection.query('UPDATE voting SET status=? where votingId=?',['投票進行中',rows_1[i].votingId], function (err, rows_2) {
                if (err) {
                  console.log(err)
                  //return;
                } else {
                  console.log('voting status update');
                }
              })
            }
          }
        }
      });
      connection.release();
    });
  }
},30000)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(session({ secret: "123456",maxAge:3000}));
app.use(function(req,res,next){
  req.connection=pool;
  next();
})

/*router*/
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sign',signRouter);
app.use('/emailverify',emailVerifyRouter);
app.use('/forgetpw',forgetpwRouter);
app.use('/resetpw',resetpwRouter);
app.use('/forgetpk',forgetpkRouter);
app.use('/login',loginRouter);
app.use('/logout',logoutRouter);
//app.use('/verify',verifyRouter)
//admin
app.use('/createvote',createVoteRouter);
app.use('/airdropNFT',airdropNFTRouter);
app.use('/workconfig',workConfigRouter);
app.use('/promote',promoteRouter);
app.use('/auditvendor',auditvendorRouter);
//activities
app.use('/activity',activityRouter);
app.use('/activity_open',openactivityRouter);
app.use('/activity_onvote', onvoteactivityRouter);
//explore
app.use('/explore',exploreRouter);
app.use("/explore_detail", exploreDetailRouter);
app.use("/explore_detail_disabled",exploreDetailDisabledRouter);
//resell
app.use('/resell',resellRouter);
//works
app.use('/works',worksRouter);
app.use('/works/buy', buyRouter);
app.use('/works/vote', voteworkRouter);
app.use('/workvoted',workvotedRounter);
app.use('/workbought',workboughtRouter);
app.use('/overview_signup',signupoverviewRouter);
app.use('/overview_vote', voteoverviewRouter);
app.use('/signup',signupRouter);
app.use('/vote',voteRouter);
//個人專區
app.use('/myinfo',myinfoRouter);
app.use('/mywork',myworkRouter);
app.use('/mycollection',mycollectionRouter);
app.use('/workupload',workuploadRouter);
app.use('/exchangetoken',exchangetokenRouter);
app.use('/transfertoken',transfertokenRouter);
app.use('/mywallet',mywalletRouter);
app.use('/myregistration',myregistrationRouter);
app.use('/modifyinfo',modifyInfoRouter);
app.use('/applyforvendor',applyforvendorRouter);

//vendor
app.use('/addCollection',addCollectionRouter);
app.use('/workListing',workListingRouter);
app.use('/vendorCollection',vendorCollectionRouter);
app.use("/goodupload", gooduploadRouter);
app.use("/uploadwork",uploadworkRouter);
app.use("/collection_detail", collectionDetailRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//var http = require('http');
//var formidable = require('formidable');
/*
http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      res.write('File uploaded');
      res.end();
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(8000);*/
module.exports = app;
