const express = require("express");
let router = express.Router();

router.get("/admin/create", (req, res) => {
     
    
    res.render("admin/createproduct",{
   
         pageTitle : "add prodcuts",  
        })
 
    

})


module.exports = router;