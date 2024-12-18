const express = require("express");
let router = express.Router();
const mongoose = require("mongoose");
let bcrypt = require("bcryptjs");  // Import bcrypt
let User = require("../../models/user.model");
const isAuthenticated = require("../../middlewares/auth-middleware");
const Order= require("../../models/order.model");
let Product = require("../../models/product.model");

// Render Login Page
router.get("/login", async (req, res) => {
  return res.render("auth/login", { showNavbar: false });
});

// Handle Login Request
router.post("/login", async (req, res) => {
  let data = req.body;
  let user = await User.findOne({ email: data.email });

  if (!user) return res.redirect("/register");  // User not found

  // Compare entered password with hashed password in the database
  const isValid = await bcrypt.compare(data.password, user.password);
  
 // if (!isValid) return res.redirect("/login");  // Invalid password

  req.session.user = user; 
  // Store user object
  req.session.isAdmin = user.role.includes("admin"); // Save user object in session
  return res.redirect("/");  // Redirect to home after login
});

// Render Register Page
router.get("/register", async (req, res) => {
  return res.render("auth/register", { showNavbar: false });
});

// Handle Register Request
router.post("/register", async (req, res) => {
    console.log("HERE1");
  let data = req.body;
  let user = await User.findOne({ email: data.email });
  console.log("HERE2");

  if (user) return res.redirect("/register"); 
  console.log("HERE3"); // User already exists

  // Hash the password before saving the user
  const salt = await bcrypt.genSalt(10);  // Generate salt
  const hashedPassword = await bcrypt.hash(data.password, salt);  // Hash the password
  console.log("HERE4");
  // Create new user with hashed password
  user = new User({
    email: data.email,
    password: hashedPassword,
  });

  await user.save(); 
  console.log("HERE5"); // Save user to the database

  return res.redirect("/login");  // Redirect to login page after registration
});

// Logout
router.get("/logout", async (req, res) => {
  req.session.user = null;
  req.session.isAdmin=null;  // Destroy session by clearing user data
  return res.redirect("/");  // Redirect to login page after logout
});


router.post("/cart/add/:id", (req, res) => {
    const productId = req.params.id; // Get the product ID from the URL
  
    // Retrieve the cart from cookies, or initialize it as an empty array
    let cart = req.cookies.cart || [];
  
    // Add the product ID to the cart if it's not already present
    if (!cart.includes(productId)) {
      cart.push(productId);
    }
  
    // Set the updated cart back into cookies
    res.cookie("cart", cart);
    res.redirect("/cart"); 
    console.log("Cart after adding product:", cart); // Debugging step
     // Redirect to the cart page
  });
  router.post("/cart/remove/:id", (req, res) => {
    const productId = req.params.id;
    let cart = req.cookies.cart || [];
    cart = cart.filter(id => id !== productId);
    res.cookie("cart", cart);
    res.redirect("/cart");
  });

  router.get("/checkout-form", async (req, res) => {
    try {
      // If user is logged in, render the checkout form
      res.render("checkout-form", { user: req.session.user });
    } catch (error) {
      console.error("Error rendering checkout form:", error);
      res.status(500).send("An error occurred while loading the checkout form.");
    }
  });
  

   
router.post("/order", async (req, res) => {
  try {
    const { name, street, city, postalCode } = req.body;
    const cart = req.cookies.cart || []; // Get cart items from cookies

    if (!name || !street || !city || !postalCode || cart.length === 0) {
      return res.status(400).send({ message: "All fields are required and cart must not be empty." });
    }

    // Retrieve product details for each productId in the cart
    const orderItems = await Promise.all(
      cart.map(async (productId) => {
        // Fetch product from the database by its ID
        const product = await Product.findOne({ id: productId }); // You are using 'id' as a field for product

        if (!product) {
          throw new Error(`Product with ID ${productId} not found`);
        }

        // Return the product details for the order
        return {
          productId: product.id,
          name: product.title,  // Assuming the product's title is the name
          price: product.price,  // Get the actual price
        };
      })
    );

    // Calculate order total (sum up the prices)
    const orderTotal = orderItems.reduce((total, item) => total + item.price, 0);

    // Create a new order
    const newOrder = new Order({
      customer: { name, street, city, postalCode },
      orderItems,
      orderTotal,
    });

    await newOrder.save(); // Save the order to the database

    // Clear cart cookies after placing the order
    res.clearCookie("cart");

    let isAdmin = req.session.isAdmin || false;
    let isLoggedIn = req.session.user || false;
    if (isAdmin) return res.redirect("/admin");

    res.render("index", {
      showNavbar: false,
      isAdmin,
      isLoggedIn,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).send({ message: "Something went wrong while placing the order." });
  }
});
// router.post("/order", async (req, res) => {
//   try {
//     const { name, street, city, postalCode } = req.body;
//     const cart = req.cookies.cart || []; // Get cart items from cookies

//     if (!name || !street || !city || !postalCode || cart.length === 0) {
//       return res
//         .status(400)
//         .send({ message: "All fields are required and the cart must not be empty." });
//     }

//     // Fetch product details for each item in the cart
//     const orderItems = cart.map((productId) => ({
//       productId, // Convert string to ObjectId
      
//       name: "Sample Product", // Replace with actual product name retrieval logic
//       price: 50, // Replace with actual product price retrieval logic
//     }));
//     // const orderItems = await Promise.all(
//     //   cart.map(async (productId) => {
//     //     // Directly use productId if it's not an ObjectId
//     //     const product = await Product.findById(productId);
//     //     if (!product) {
//     //       throw new Error(`Product with ID ${productId} not found`);
//     //     }

//     //     return {
//     //       productId: product._id,
//     //       name: product.name, // Retrieve product name
//     //       price: product.price, // Retrieve product price
//     //     };
//     //   })
//     // );

//     // Process the order (e.g., save to database, return success response, etc.)
//     res.status(201).send({ message: "Order placed successfully", orderItems });
//   } catch (error) {
//     console.error("Error placing order:", error.message);
//     res.status(500).send({ message: "Error placing order", error: error.message });
//   }
// });


  
module.exports = router;
