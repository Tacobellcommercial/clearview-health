const express = require("express");
const router = express.Router();

const Patient = require("../models/Patient.js")

router.post("/", (req, res)=>{
  Patient.find({"username": req.body.username}, (err, arrayOfDocuments)=>{
    if (arrayOfDocuments.length == 0){
      bcrypt.hash(req.body.password, 10, (err, encryptedPassword)=>{
        const newPatient = new Patient({
          firstName: req.body.fName,
          lastName: req.body.lName,
          username: req.body.username,
          password: encryptedPassword,
          authority: "Patient"
        })

        newPatient.save((err, result)=>{
          res.render("Register", {
            title: "Register | Clearview Health",
            errorMessage: "",
            successMessage: "Successfully signed up!"
          })
        })
      })
    }else{
      res.render("Register", {
        title: "Register | Clearview Health",
        errorMessage: "Username already taken...",
        successMessage: ""
      })
    }
  })
})

module.exports = router;
