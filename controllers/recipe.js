const User = require('../models/user');
const Recipe = require('../models/recipe');

module.exports = {
    index,
    getIndex,
    create,
    edit,
    delete: deleteItem,
}

function index(req, res, next){
    res.render('recipes/index.ejs',{
        title: `breadBox - Recipes - ${req.user.name}`,
        user: req.user,
        active: "recipes",
    });
}
async function getIndex(req, res, next){
    try{
        let result = await Recipe.find({user: req.user._id});
        return res.send(result);
    }
    catch(err){
        res.render('error',{
            message: 'recipe.js controller - getindex',
            error: err,
        })
    }
}

async function create(req, res, next){
    try{
        let thisUser = await User.findById(req.user._id);
        let newRecipe = {
            name: req.body.name,
            description: req.body.description,
            user: req.user._id,
        }
        await Recipe.create(newRecipe);
        return res.status(200).send("create")
    }catch(err){
        res.render('error',{
            message: 'recipe.js controller - create',
            error: err,
        })
    }
}
async function edit(req,res, next){
    res.render('recipes/edit',{
        title: "Edit",
        user: req.user,
        active: "recipes",
    })
}
async function deleteItem(req, res, next){
    try{
        await Recipe.deleteOne({_id: req.params.id});
        return res.status(200).send("delete");
    }catch(err){
        res.render('error',{
            message: 'recipe.js controller - create',
            error: err,
        })
    }
}