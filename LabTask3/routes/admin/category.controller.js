
const express = require("express");
let router = express.Router();


const category = require("../../models/category.model")
//To Get Products
router.get("/admin/category", async (req, res) => {
  try {
    const categories = await category.find();

    return res.render("admin/category", {
      layout: "adminlayout",
      pageTitle: "Products Management",
      categories,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Error fetching products from the database.");
  }
})



router.get("/admin/category/create", (req, res) => {
  
    return res.render("admin/createCategory",
      {
        layout: "adminLayout",
  
      });
   
  });
  
  //route to handle create product form submission
  // demonstrates PRG Design Pattern (Post Redirect GET)
  router.post("/admin/category/create", async (req, res) => {
    console.log(req.body)
    try {
        let newCategory = new category(req.body); // Mongoose auto-validates based on the schema
        await newCategory.save();
        res.redirect("/admin/category");
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(400).send("Product creation failed. Please ensure all fields are filled correctly.");
    }
  });
  
  router.get("/admin/category", async (req, res) => {
    let categories = await category.find();
    return res.render("admin/category", {
      layout: "adminlayout",
      pageTitle: "Manage Your Products",
      categories,
    });
  });



//Delete Product
router.get("/admin/category/delete/:id",async (req,res)=>{
  let params=req.params;
  let categoryDelete = await category.findByIdAndDelete(req.params.id);
  return res.redirect("/admin/category");

})

// //edit Product
// router.get("/admin/products/edit/:id", async (req, res) => {
//   let product = await Product.findById(req.params.id);
//   return res.render("admin/edit-form", {
//     layout: "adminlayout",
//     product,
//   });
// });
// router.post("/admin/products/edit/:id", async (req, res) => {
//   let product = await Product.findById(req.params.id);
//   product.id=req.body.id;
//   product.title = req.body.title;
//   product.brand=req.body.brand;
//   product.description = req.body.description;
//   product.price = req.body.price;
//   await product.save();
//   return res.redirect("/admin/products");
// });

module.exports = router;

