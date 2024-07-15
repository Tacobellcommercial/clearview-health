const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const Doctor = require("../models/Doctor.js");

router.post("/", (req, res)=>{
  const arrayOfDocuments = Doctor.find({"username": req.body.username});

  let fieldMissing = false;
  let passwordTooShort = false;
  for (const key in req.body){
    if (req.body[key] == ""){
      fieldMissing = true;
    }
  }

  if (fieldMissing){
    res.render("Register", {
      title: "Register | Clearview Health",
      doctor: false,
      patient: false,
      errorMessage: "Please fill in all fields...",
    })
  }else if ((req.body.password.length < 6) || (req.body.password.length > 15)){
    res.render("Register", {
      title: "Register | Clearview Health",
      doctor: false,
      patient: false,
      errorMessage: "Password must be between 6 and 15 characters...",
    })
  }else{
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

        await newDoctor.save();

        res.redirect("/login");
      })
    }else{
      res.render("Register", {
        title: "Register | Clearview Health",
        doctor: false,
        patient: false,
        errorMessage: "Username already taken...",
      })
    }
  }

})

module.exports = router;
