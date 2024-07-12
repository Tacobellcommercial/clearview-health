const express = require("express");
const router = express.Router();

const passport = require("passport");

router.post("/", (req, res, next)=>{
  passport.authenticate("doctorStrategy", (err, user, info)=>{
    if (!user){
      res.redirect("/login")
    }else{
      req.logIn(user, (err)=>{
        res.redirect("/home");
      })
    }
  })(req, res, next);
})

module.exports = router;
