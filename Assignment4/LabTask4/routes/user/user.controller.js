const express = require("express");
let router = express.Router();
let bcrypt = require("bcryptjs");  // Import bcrypt
let User = require("../../models/user.model");
const isAuthenticated = require("../../middlewares/auth-middleware");

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

module.exports = router;
