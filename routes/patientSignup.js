const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const Patient = require("../models/Patient.js")

router.post("/", async (req, res)=>{
  const arrayOfDocuments = await Patient.find({"username": req.body.username});

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
    if (arrayOfDocuments.length == 0){
      bcrypt.hash(req.body.password, 10, (err, encryptedPassword)=>{

        const newPatient = new Patient({
          firstName: req.body.fName,
          lastName: req.body.lName,
          phoneNumber: req.body.phoneNumber,
          dateOfBirth: req.body.date_of_birth,
          biologicalSex: req.body.biological_sex,
          doctorsList: [],
          awaitingDoctors: [],
          prescriptionList: [],
          labs: [],
          username: req.body.username, /*email*/
          password: encryptedPassword,
          authority: "Patient"
        })

        await newPatient.save();

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
