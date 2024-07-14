const express = require("express");
const router = express.Router();

const passport = require("passport");


router.post("/", (req, res, next) => {
  passport.authenticate("patientStrategy", (err, user, info)=>{
    if (!user){
      res.render("Login", {
        title: "Login | Clearview Health",
        errorMessage: "Wrong username/password...",
        successMessage: "",
        doctor: false,
        patient: false,
      })
    }else{
      req.logIn(user, (err)=>{
        console.log(user);
        res.redirect("/home");
      })
    }
  })(req, res, next);
});

module.exports = router;
