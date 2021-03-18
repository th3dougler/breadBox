const User = require("../models/user");
const Recipe = require("../models/recipe");

module.exports = {
  getIndex,
  getTable,
  getReadOnly,
  getReadOnlyRecipe,
  update,
};

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
}

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
}
async function getReadOnly(req,res,next){
  try{
    let thisRecipe = await Recipe.findById(req.params.id);
    if (thisRecipe.private === false){
      res.render('api/readonly',{
      title: `${thisRecipe.name}`,
      recipe: thisRecipe,
      });

    }else{
      res.send("Recipe is private, or URL is malformed")
    }
  }catch{
    res.render("error", {
      message: "recipe.js controller - getReadOnly",
      error: err,
    });
  }
}

async function getReadOnlyRecipe(req,res,next){
  try{
    let thisRecipe = await Recipe.findById(req.params.id);
    if (thisRecipe.private === false){
      res.send(thisRecipe);
    }else{
      res.send("Recipe is private, or URL is malformed")
    }
  }catch{
    res.render("error", {
      message: "recipe.js controller - getReadOnly",
      error: err,
    });
  }
}


async function update(req, res, next) {
  try {

    
    if(req.query.data == "col"){
      let tables = Number.parseInt(req.query.table);
      await Recipe.findByIdAndUpdate(
        req.params.id,
        {
          recipeColumns: JSON.stringify(req.body),
          recipeTables: tables,
        },
        { useFindAndModify: false }
      );
    }else{
      delete req.query.data;
      await Recipe.findByIdAndUpdate(
        req.params.id,
        {
          recipeRows: JSON.stringify(req.body),
          tableHeaders: Object.values(req.query),
        },
        { useFindAndModify: false }
      );
    }
    Recipe.save();
    res.sendStatus(200);
  } catch (err) {
    res.render("error", {
      message: "recipe.js controller - update",
      error: err,
    });
  }
}