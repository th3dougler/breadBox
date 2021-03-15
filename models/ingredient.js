var mongoose = require('mongoose');

var ingredientSchema = new mongoose.Schema({
    name: String,
    description: String,
},{
    timestamps: true,
})

module.exports = mongoose.model("Ingredient", ingredientSchema);