var mongoose = require('mongoose');

var recipeSchema = new mongoose.Schema({
    name: String,
    description: String,
    user: {type: mongoose.SchemaTypes.ObjectId, ref: "User"},
    uomPref: {type: Boolean, default: true},
    private: {type: Boolean, default: true},
    isIngredient: {type: Boolean, default: false},
    method: String,
    recipeRows: {type: String, default: "[{}]"},
    recipeColumns: {type: String, default: "[{}]"},
    recipeTables: {type: Number, default: 0},
    tableHeaders: [{type: String}],
    tags: [{type: String}],
},{
    timestamps: true,
})

module.exports = mongoose.model("Recipe", recipeSchema);