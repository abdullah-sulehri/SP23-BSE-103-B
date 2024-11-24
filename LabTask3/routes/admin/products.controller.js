
const express = require("express");
let router = express.Router();


const Product = require("../../models/product.model")

router.get("/admin/products", async (req, res) => {
  try {
    const products = await Product.find();

    return res.render("admin/products", {
      pageTitle: "Products Management",
      products: products,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Error fetching products from the database.");
  }
})


module.exports = router;