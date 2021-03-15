var router = require('express').Router();
var recipeCtrl = require('../controllers/recipe')
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/auth/google");
}

router.get('/', isLoggedIn, recipeCtrl.index);




module.exports = router;