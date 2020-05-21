var mongoose = require("mongoose");
var productSchema = mongoose.Schema({
    name: { type: String },
    image: { type: String },
    price: { type: String },
    id: { 
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    desc: { type: String },
    expiryDate: String
});
module.exports = mongoose.model("Product", productSchema);