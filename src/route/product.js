const express = require("express");
const router = new express.Router();
const Product = require("../database/productmodel");
   


router.post('/addProduct', (req, res) => {
    //console.log(req);
    var name = req.body.name,
        image = req.body.image,
        price = req.body.price,
        id = req.body.id,
        desc = req.body.desc,
        expiryDate = req.body.expiryDate;
    var newProduct = { name, image, price, id, desc, expiryDate };
    Product.create(newProduct, (err, succ) => {
        if (err) res.status(400).json({ error: err });
        else res.status(200).json({ success: "Product Created" });
    });
});

router.get("/getProduct/:id", (req, res) => {
    var id = req.params.id;
    Product.findOne({ id })
        .then(product => {
            console.log(product);
            res.status(200).json({ status: 200, product });
        })
        .catch(err => {
            res.status(400).json({ error: err });
        });
});

router.get("/getAll",(req,res)=>{
    Product.find().then((products)=>{
        res.status(200).json({status:200, products});
    }).catch((err)=>{
        res.status(400).json({ error: err });
    })
})

module.exports = router;