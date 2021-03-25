const User = require("../models/user");
const Recipe = require("../models/recipe");

module.exports = {
  index,
  create,
  update,
  edit,
  delete: deleteItem,
};
/* //get array of all recipes owned by user
async function getIndex(req, res, next) {
  try {
    let result = await Recipe.find({ user: req.user._id });
    return res.send(result);
  } catch (err) {
    res.render("error", {
      message: "recipe.js controller - getindex",
      error: err,
    });
  }
} */

/* 
async function getTable(req, res, next) {
  try {
    let thisRecipe = await Recipe.findById(req.params.id);
    return res.send(thisRecipe)
  } catch (err) {
    res.render("error", {
      message: "recipe.js controller - getTable",
      error: err,
    });
  }
} */


//get index view
function index(req, res, next) {
  res.render("recipes/index.ejs", {
    title: `breadBox - Recipes - ${req.user.name}`,
    user: req.user,
    active: "recipes",
  });
}


//create new recipe document
async function create(req, res, next) {
  try {
    let newRecipe = {
      name: req.body.name,
      description: req.body.description,
      user: req.user._id,
    };
    await Recipe.create(newRecipe);
    return res.status(200).send("create");
  } catch (err) {
    res.render("error", {
      message: "recipe.js controller - create",
      error: err,
    });
  }
}

//get recipe edit view
async function edit(req, res, next) {
  try {
    let thisRecipe = await Recipe.findById(req.params.id);
    res.render("recipes/edit", {
      title: `Edit - ${thisRecipe.name}`,
      user: req.user,
      active: "recipes",
      recipe: thisRecipe,
    });
  } catch (err) {
    res.render("error", {
      message: "recipe.js controller - edit",
      error: err,
    });
  }
}

//recipe update function, only with correctly formed data (i.e. updating name, description via form)
async function update(req, res, next){
    try{
        await Recipe.findByIdAndUpdate(req.params.id, req.body,
          { useFindAndModify: false });
        
    } catch (err) {
        res.render("error", {
          message: "recipe.js controller - update",
          error: err,
        });
    }
}
async function deleteItem(req, res, next) {
  try {
    await Recipe.deleteOne({ _id: req.params.id });
    return res.status(200).send("delete");
  } catch (err) {
    res.render("error", {
      message: "recipe.js controller - create",
      error: err,
    });
  }
}



