const express = require("express");
const router = new express.Router();
const Product = require("../database/productmodel");

router.post("/addProduct", (req, res) => {
  console.log(req.body);
  var name = req.body.name,
    image = req.body.image,
    price = req.body.price,
    id = req.body.id,
    desc = req.body.desc,
    expiryDate = req.body.expiryDate;
  var newProduct = { name, image, price, id, desc, expiryDate };
  Product.create(newProduct, (err, succ) => {
    if (err) {
      res.status(400).json({ message: "Barcode already exist." });
    } else res.status(200).json({ success: "Product Created" });
  });
});

router.get("/getProduct/:id", (req, res) => {
  var id = req.params.id;
  Product.findOne({ id })
    .then((product) => {
      console.log(product);
      if (product) {
        return res.status(200).json({ status: 200, product });
      } else {
        return res.status(400).json({ message: "Item Does Not Exist!!" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: "Problem occured in server!!" });
    });
});

router.get("/getAll", (req, res) => {
  Product.find()
    .then((products) => {
      res.status(200).json({ status: 200, products });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

module.exports = router;
