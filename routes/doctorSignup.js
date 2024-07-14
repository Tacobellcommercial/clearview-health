const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const Doctor = require("../models/Doctor.js");

router.post("/", (req, res)=>{
  const arrayOfDocuments = Doctor.find({"username": req.body.username});
  if (arrayOfDocuments.length === 0){
    bcrypt.hash(req.body.password, 10, (err, encryptedPassword)=>{
      const newDoctor = new Doctor({
        firstName: req.body.fName,
        lastName: req.body.lName,
        licenseNumber: req.body.licenseNumber,
        practiceName: req.body.practiceName,
        phoneNumber: req.body.practicePhoneNumber,
        patientList: [],
        awaitingPatients: [],
        username: req.body.username,
        password: encryptedPassword,
        authority: "Doctor"
      })

      newDoctor.save((err, result)=>{
        res.redirect("/login");
      })
    })
  }else{
    res.redirect("/register");
  }
})

module.exports = router;
