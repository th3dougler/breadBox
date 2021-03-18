var express = require("express");
var router = express.Router();
let passport = require('passport');
var apiCtrl = require('../controllers/api')
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/auth/google");
}

router.get('/getIndex', isLoggedIn, apiCtrl.getIndex);

router.get('/:id', isLoggedIn, apiCtrl.getTable);

router.put('/:id', isLoggedIn, apiCtrl.update);

module.exports = router;