//const User = require('../models/user');
module.exports = {
    index,
}

function index(req, res, next){
    res.render('recipes/index.ejs',{
        title: `breadBox - Recipes - ${req.user.name}`,
        user: req.user,
        active: "recipes",
    });
}