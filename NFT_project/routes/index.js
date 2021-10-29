var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if(req.session.verified==0){
    res.redirect('/verify');
  }
  res.render('index', {
    title: 'Express',
    email: req.session.email,
    role: req.session.role,
  });
  
});

module.exports = router;
