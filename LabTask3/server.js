const express = require("express");
let server = express();
server.use(express.urlencoded({ extended: true }));




server.set("view engine", "ejs");
var expressLayouts = require("express-ejs-layouts");

let adminProductsRouter = require("./routes/admin/products.controller");
server.use(adminProductsRouter);

let addProductRouter = require("./routes/admin/addProduct.controller");
server.use(addProductRouter);

server.use(express.static("public"));
// server.use(expressLayouts);

const mongoose = require("mongoose");

mongoose
    .connect('mongodb://localhost:27017/RajaSahibdb' , { // Connect to the database only
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });


server.get("/",(req,res)=>{
    res.render("index")
});

server.get("/portfolio",(req,res)=>{
    res.render("portfolio")
});

server.get("/admin",(req,res)=>{
    res.render("admin")
});






server.listen(5030,()=> {    
    console.log(`server created at local host 5030`);
});