
const express = require("express");
let router = express.Router();


const Product = require("../../models/product.model")
//To Get Products
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


//To Add new products
router.get("/admin/products/create", (req, res) => {
  
  return res.render("admin/createproduct",
    {
      layout: "adminLayout",

    });
 
});

//route to handle create product form submission
// demonstrates PRG Design Pattern (Post Redirect GET)
router.post("/admin/products/create", async (req, res) => {
  console.log(req.body)
  try {
      let newProduct = new Product(req.body); // Mongoose auto-validates based on the schema
      await newProduct.save();
      res.redirect("/admin/products");
  } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).send("Product creation failed. Please ensure all fields are filled correctly.");
  }
});

router.get("/admin/products", async (req, res) => {
  let products = await Product.find();
  return res.render("admin/products", {
    layout: "adminlayout",
    pageTitle: "Manage Your Products",
    products,
  });
});

//Delete Product
router.get("/admin/products/delete/:id",async (req,res)=>{
  let params=req.params;
  let product = await Product.findByIdAndDelete(req.params.id);
  return res.redirect("/admin/products");

})

//edit Product
router.get("/admin/products/edit/:id" ,async (req,res)=>{
  
})

module.exports = router;

