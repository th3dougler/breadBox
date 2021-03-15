var mongoose = require('mongoose');

var recipeSchema = new mongoose.Schema({
    name: String,
    user: {type: mongoose.SchemaTypes.ObjectId, ref: "User"},
    uomPref: {type: Boolean, default: true},
    private: {type: Boolean, default: true},
    isIngredient: {type: Boolean, default: false},
    method: String,
    tags: [String],
    inventory:  [{type: mongoose.SchemaTypes.ObjectId, ref: "Ingredient"}],
    userInventory: [{type: mongoose.SchemaTypes.ObjectId, ref: "CustomIngredient"}]
},{
    timestamps: true,
})

module.exports = mongoose.model("Recipe", recipeSchema);