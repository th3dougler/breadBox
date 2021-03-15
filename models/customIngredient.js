var mongoose = require('mongoose');

var ingredientSchema = new mongoose.Schema({
    userId: {type: mongoose.SchemaTypes.ObjectId, ref: "User"},
    name: String,
    description: String,
},{
    timestamps: true,
})

module.exports = mongoose.model("CustomIngredient", ingredientSchema);