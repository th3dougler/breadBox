var router = require('express').Router();
var inventoryCtrl = require('../controllers/inventory')

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/auth/google");
}

router.get('/', isLoggedIn, inventoryCtrl.index);

router.get('/getIndex', isLoggedIn, inventoryCtrl.getIndex);


router.post('/', isLoggedIn, inventoryCtrl.create);

router.delete('/:id', isLoggedIn, inventoryCtrl.delete)

module.exports = router;