const User = require('../models/user');
const CustomIngredient = require('../models/customIngredient');
var FuzzySearch = require('fuzzy-search');

module.exports = {
    index,
    getIndex,
    getFuzzy,
    create,
    delete: deleteItem,
}

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

async function getFuzzy(req, res, next){
    try{
       let arr = await CustomIngredient.find({user: req.user._id});
       const searcher = new FuzzySearch(arr, ['name']);
       const result = searcher.search(req.query.search);
       res.send(result);
    }catch(err){
        res.render('error',{
            message: 'inventory controller - getfuzzy',
            error: err,
        })
    }
}

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