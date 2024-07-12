const express = require("express");
const router = express.Router();


router.get("/", (req, res)=>{
  if (req.isAuthenticated()){
    if (req.user.authority == "Doctor"){
      res.render("LandingPage", {
        title: "Landing Page | Clearview Health",
        doctor: true,
        patient: false,
      })
    }else if (req.user.authority == "Patient"){
      res.render("LandingPage", {
        title: "Landing Page | Clearview Health",
        doctor: false,
        patient: true,
      })
    }
  }else{
    res.render("LandingPage", {
      title: "Landing Page | Clearview Health",
      doctor: false,
      patient: false
    });
  }
})

module.exports = router;
