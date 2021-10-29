var express = require('express');
var router = express.Router();
require('dotenv').config();
const multer=require('multer');
const pinataApikey=process.env.PINATA_APIKEY;
const pinatasecret=process.env.PINATA_APISECRET;
const fs=require('fs');
const FormData=require('form-data');
const pinataSDK=require('@pinata/sdk');
//const { path } = require('../../app');
const { default: axios } = require('axios');
require('body-parser');
const pinata=pinataSDK(pinataApikey,pinatasecret);
/*
const imageStorage=multer.diskStorage({
    destination:'../uploads',
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+path.extname(file.originalname))
    }
});
const imageUpload=multer({
    storage:imageStorage,
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
})*/
/* GET home page. */
router.get('/', function (req, res) {
    if (!req.session.email) {
        res.redirect('/login');
    }
    res.render('personal/workupload', {
        title: '作品上傳',
        email: req.session.email,
        role: req.session.role,
    });

});
router.post('/',function(req,res){
    //res.send(req.file)
    var author=req.session.userfirstname+req.session.userlastname;
    var authoraddress=req.session.walletaddress;
    var name=req.body['name'];
    var symbol=req.body['symbol'];
    var uri=req.body['image'];
    var readableStreamForFile=fs.createReadStream('./uploads/'+uri);
    var options={
        pinataMetadata:{
            name:name,
            keyvalues:{
                customKey1:author,
                custonKey2:symbol
            }
        },
        pinataOptions:{
            cidVersion:0
        }
    };
    var ipfsuri=pinata.pinFileToIPFS(readableStreamForFile,options);
    consolg.loe(ipfsuri)
    var pool=req.connection;
    pool.getConnection(function(err,connection){
        connection.query('INSERT INTO art_works (votingId,participantId,name,symbol,author,uri,authoraddress,available)',[0,0,name,symbol,author,ipfsuri,authoraddress,0],function(err,rows){
            if (err) {
                res.redirect('/sign');
                console.log(err)
            }else{
                console.log('upload success')
                req.redirect('/');
            }
        })
    })
})
module.exports = router;