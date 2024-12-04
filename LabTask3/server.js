const express = require("express");
let server = express();
const bodyParser = require("body-parser");
const multer = require('multer');


server.use(express.urlencoded({ extended: true }));




server.set("view engine", "ejs");
var expressLayouts = require("express-ejs-layouts");

let adminProductsRouter = require("./routes/admin/products.controller");


let adminCategoryRouter = require("./routes/admin/category.controller");
server.use(adminProductsRouter);
server.use(adminCategoryRouter);
server.use(expressLayouts);

server.use(bodyParser.urlencoded({ extended: true })); // For forms
server.use(bodyParser.json()); 

server.use(express.static("public"));
server.use(express.static("uploads"));


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads'); // Directory to store files
//     },
//     filename: function (req, file, cb) {
//       cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
//     },
//   });
  
//   const upload = multer({ storage: storage });

const mongoose = require("mongoose");

mongoose
    .connect('mongodb+srv://abSulehri:dKBh0V1jAd1HoYzs@cluster0.6bjcq.mongodb.net/RajaSahib' , { // Connect to the database only
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