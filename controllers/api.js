const User = require("../models/user");
const Recipe = require("../models/recipe");

module.exports = {
  getIndex,
  getTable,
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
      console.log(req.params)
    let thisRecipe = await Recipe.findById(req.params.id);
    console.log(thisRecipe);
    return res.send(thisRecipe)
  } catch (err) {
    res.render("error", {
      message: "recipe.js controller - getTable",
      error: err,
    });
  }
}

async function update(req, res, next) {
  try {
    let tables = Number.parseInt(req.query.table);
    console.log(req.params, Number.parseInt(req.query.table), req.body)
    if(req.query.data == "col"){
      await Recipe.findByIdAndUpdate(
        req.params.id,
        {
          recipeColumns: JSON.stringify(req.body),
          recipeTables: tables,
        },
        { useFindAndModify: false }
      );
    }else{
      await Recipe.findByIdAndUpdate(
        req.params.id,
        {
          recipeRows: JSON.stringify(req.body),
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