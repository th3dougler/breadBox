var router = require('express').Router();
var recipeCtrl = require('../controllers/recipe')

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/auth/google");
}

router.get('/', isLoggedIn, recipeCtrl.index);

router.get('/getIndex', isLoggedIn, recipeCtrl.getIndex);

router.post('/', isLoggedIn, recipeCtrl.create);


router.get('/:id/edit', isLoggedIn, recipeCtrl.edit);

router.delete('/:id', isLoggedIn, recipeCtrl.delete);

module.exports = router;