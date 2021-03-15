var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    avatar: String,
    googleId: String,
    recipes: [{type: mongoose.SchemaTypes.ObjectId, ref: "Recipe"}],
    userInventory: [{type: mongoose.SchemaTypes.ObjectId, ref: "CustomIngredient"}],
    
    
},{
    timestamps: true,
})

module.exports = mongoose.model("User", userSchema);