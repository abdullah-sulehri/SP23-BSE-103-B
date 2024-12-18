const express = require("express");
let server = express();
const bodyParser = require("body-parser");
const multer = require('multer');
let Product = require("../LabTask4/models/product.model");
let User = require("./models/user.model");

// Express and session setup
server.use(express.urlencoded({ extended: true }));
const cookieParser = require("cookie-parser");
const session = require("express-session");
server.use(cookieParser());
server.use(session({ secret: "My session secret" }));

// Import routes and middlewares
let siteMiddleware = require("./middlewares/site-middleware");
let authMiddleware = require("./middlewares/auth-middleware");

server.set("view engine", "ejs");
var expressLayouts = require("express-ejs-layouts");

let adminProductsRouter = require("./routes/admin/products.controller");
let adminCategoryRouter = require("./routes/admin/category.controller");

// Import user controller
let userController = require("./routes/user/user.controller");

// Use routes
server.use(adminProductsRouter);
server.use(adminCategoryRouter);
server.use(userController);  // Add user controller for handling login, register, and logout

server.use(expressLayouts);

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use(express.static("public"));
server.use(express.static("uploads"));

// MongoDB connection
const mongoose = require("mongoose");
mongoose
  .connect('mongodb+srv://abSulehri:dKBh0V1jAd1HoYzs@cluster0.6bjcq.mongodb.net/RajaSahib', { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Basic Routes
server.get("/", (req, res) => {
    let isAdmin = req.session.isAdmin || false;
    let isLoggedIn = req.session.user || false;
    if (isAdmin) return res.redirect("/admin");  
  res.render("index", {
    showNavbar: false,
    isAdmin,
    isLoggedIn,
  });
});

server.get("/portfolio", (req, res) => {
  res.render("portfolio", { showNavbar: false });
});

server.get("/admin", (req, res) => {
  res.render("admin", { showNavbar: false });
});

server.get("/cards", async (req, res) => {
  const products = await Product.find();
  res.render("product-cards", {
    products: products,
    showNavbar: true
  });
});
server.get("/cart", (req, res) => {
    // Check if user is logged in
    if (!req.session.user) {
      return res.redirect("/login"); // Redirect to login page if not logged in
    }
  
    // Retrieve the cart from cookies or initialize it as an empty array
    let cart = req.cookies.cart || [];
  
    // You can also retrieve product details from your database if necessary
    // For example, you could fetch product details based on the cart items
    Product.find({ id: { $in: cart } })
      .then((products) => {
        // Render the cart page with the productss
        res.render("cart", {
          showNavbar: true,
          products: products, // Products in the cart
          cart: cart, // Product IDs in the cart
        });
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        res.status(500).send("Something went wrong");
      });
  });

// Middleware for setting showNavbar globally (optional)
server.use((req, res, next) => {
  res.locals.showNavbar = false,
  next();
});

// Admin Middleware setup (if necessary)
let adminMiddleware = require("./middlewares/admin-middleware");
server.use("/", authMiddleware, adminMiddleware, adminProductsRouter);

// Start server
server.listen(5030, () => {
  console.log(`Server created at local host 5030`);
});
