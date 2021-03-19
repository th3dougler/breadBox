const User = require('../models/user');
const CustomIngredient = require('../models/customIngredient');
const Ingredient = require('../models/ingredient');
var FuzzySearch = require('fuzzy-search');
let staticIngredients;

//on server startup, get the list of static ingredients and store in memory
//reduce unnecessary db calls during fuzzy search
(async ()=>{
        try{
            staticIngredients = await Ingredient.find({},{"_id":0,"name":1}); 
        } catch(err){
            console.log(err);
        }
    })()
module.exports = {
    index,
    getIndex,
    getFuzzy,
    create,
    delete: deleteItem,
}


//get inventory index view
async function index(req, res, next){
    try{
        res.render('inventory/index.ejs',{
            title: `breadBox - Inventory - ${req.user.name}`,
            user: req.user,
            active: "inventory",
        });
    }catch(err){
        res.render('error',{
            message: 'inventory controller - index',
            error: err,
        })
    }
}

//get array list of all custom ingredients
async function getIndex(req, res, next){
    try{
        let result = await CustomIngredient.find({user: req.user._id});
        res.send(result);
    }catch(err){
        res.render('error',{
            message: 'inventory controller - getindex',
            error: err,
        })
    }
}

//combine custom ingredients with static ingredients and perform fuzzy search
async function getFuzzy(req, res, next){
    try{
       let arr = await CustomIngredient.find({user: req.user._id},{"_id":0,"name":1});
       let combinedArray = arr.concat(staticIngredients);
       const searcher = new FuzzySearch(combinedArray, ['name']);
       const result = searcher.search(req.query.search);
       result.splice(10);
       res.send(result);
    }catch(err){
        res.render('error',{
            message: 'inventory controller - getfuzzy',
            error: err,
        })
    }
}

//create new custom ingredient
async function create(req, res, next){
    try{
        let newItem = {
            name: req.body.name,
            description: req.body.description,
            user: req.user._id,
        }
        await CustomIngredient.create(newItem);
        return res.status(200).send("create")
    }catch(err){
        res.render('error',{
            message: 'inventory controller - create',
            error: err,
        })
    }
}

//who knows.. 
async function deleteItem(req, res, next){
    try{
        await CustomIngredient.deleteOne({_id: req.params.id});
        return res.status(200).send("delete");
    }catch(err){
        res.render('error',{
            message: 'inventory controller - deleteitem',
            error: err,
        })
    }
}