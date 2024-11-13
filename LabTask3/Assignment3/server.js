const express = require("express");
let server = express();

server.set("view engine", "ejs");
var expressLayouts = require("express-ejs-layouts");

let adminProductsRouter = require("./routes/admin/products.controller");
server.use(adminProductsRouter);

server.use(express.static("public"));
server.use(expressLayouts);

server.get("/",(req,res)=>{
    res.render("index")
});

server.get("/portfolio",(req,res)=>{
    res.render("portfolio")
});

server.get("/admin",(req,res)=>{
    res.render("admin")
});

server.get("/createproduct",(req,res)=>{
    res.render("createproduct")
})

server.listen(5030,()=> {    
    console.log(`server created at local host 5020`);
});