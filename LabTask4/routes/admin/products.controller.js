
const express = require("express");
let Product = require("../../models/product.model");
let router = express.Router();
const Category = require("../../models/category.model");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Directory to store files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});
const upload = multer({ storage: storage });
router.get("/admin/products/create", async (req, res) => {
  console.log("HERE")
  try {
    console.log("HERE")
    const categories = await Category.find();
    console.log("HERE") // Fetch all categories
    return res.render("admin/createproduct", {
      pageTitle: "Create Product",
      layout: "adminLayout",
      styles: "/styles/create-product-form.css",
      categories: categories, // Pass categories to the view
    });
    console.log("HERE")
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Error fetching categories.");
  }
});

// Route to handle create product form submission
// Demonstrates PRG Design Pattern (Post Redirect GET)
router.post("/admin/products/create", upload.single("file"), async (req, res) => {
  console.log(req.body);
  try {

    let newProduct = new Product(req.body);

    if (req.file) {
      console.log(req.file.filename);
      newProduct.picture = req.file.filename;
    }

    await newProduct.save();
    res.redirect("/admin/products");
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(400)
      .send("Product creation failed. Please ensure all fields are filled correctly.");
  }
});

//To Get Products
router.get("/admin/products/:page?", async (req, res) => {
  let page = req.params.page;
  page = page ? Number(page) : 1;
  let pageSize = 5;
  let totalRecords = await Product.countDocuments();
  let totalPages = Math.ceil(totalRecords / pageSize);
  try {
    const products = await Product.find().populate("category", "name ") // Populate category details
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    return res.render("admin/products", {
      layout: "adminLayout",
      pageTitle: "Products Management",
      products,
      page,
      pageSize,
      totalPages,

    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Error fetching products from the database.");
  }
});


// To Add new products


// Delete Product
router.get("/admin/products/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.redirect("/admin/products");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Error deleting product.");
  }
});

// Edit Product
router.get("/admin/products/edit/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category"); // Populate current category
    const categories = await Category.find(); // Fetch all categories

    return res.render("admin/edit-form", {
      layout: "adminlayout",
      product,
      categories, // Pass categories to the view
    });
  } catch (error) {
    console.error("Error fetching product or categories:", error);
    res.status(500).send("Error fetching product or categories.");
  }
});

router.post("/admin/products/edit/:id", async (req, res) => {
  try {


    const product = await Product.findById(req.params.id);
    product.id = req.body.id;
    product.title = req.body.title;
    product.brand = req.body.brand;
    product.description = req.body.description;
    product.price = req.body.price;
    product.category = req.body.category;

    await product.save();
    return res.redirect("/admin/products");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).send("Product update failed.");
  }
});

module.exports = router;

