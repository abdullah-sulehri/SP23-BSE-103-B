const express = require("express");
let router = express.Router();

router.post("/admin/createproduct", (req, res) => {
    try {    
    
    return   res.render("admin/createproduct",{
   
         pageTitle : "add prodcuts",  
        })
    }
    catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("Error fetching products from the database.");
      }

})


module.exports = router;