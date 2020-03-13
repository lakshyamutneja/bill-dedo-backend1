var mongoose = require("mongoose");
var productSchema = mongoose.Schema({
    name: { type: String },
    image: { type: String },
    price: { type: String },
    id: { type: String },
    desc: { type: String },
    expiryDate: String
});
module.exports = mongoose.model("Product", productSchema);