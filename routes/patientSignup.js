const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const Patient = require("../models/Patient.js")

router.post("/", (req, res)=>{
  Patient.find({"username": req.body.username}, (err, arrayOfDocuments)=>{
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
          username: req.body.username, /*email*/
          password: encryptedPassword,
          authority: "Patient"
        })

        newPatient.save((err, result)=>{
          res.redirect("/login");
        })
      })
    }else{
      res.redirect("/register");
    }
  })
})

module.exports = router;
