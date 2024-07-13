const express = require("express");
const router = express.Router();

const Doctor = require("../models/Doctor");

router.get("/:id", (req, res)=>{
  const id = req.params.id;

  Doctor.findOne({_id: id}, (err, result)=>{
    if (!result){
      console.log("Error...")
      res.redirect("/home");
    }else if (result){
      if (req.isAuthenticated()){
        res.render("DoctorProfile", {
          title: "Doctor Profile | Clearview Health",
          doctor: req.user.authority == "Doctor",
          patient: req.user.authority == "Patient",
          doctorObject: result
        })
      }else{
        res.render("DoctorProfile", {
          title: "Doctor Profile | Clearview Health",
          doctor: false,
          patient: false,
          doctorObject: result
        })
      }
    }
  })
})


module.exports = router;
