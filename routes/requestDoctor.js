const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

router.post("/", (req, res)=>{
  if (req.isAuthenticated()){
    if (req.user.authority == "Patient"){
      console.log(req.user);
      Doctor.findOne({_id: req.body.id}, (err, doctorObject)=>{
        let userAlreadyRequested = false
        let doctorAlreadyAccepted = false
        doctorObject.awaitingPatients.forEach(element=>{

          if (element.id == req.user.id){
            userAlreadyRequested = true
          }
        })

        doctorObject.patientList.forEach(element=>{
          if (element._id.equals(mongoose.Types.ObjectId(req.user.id))){
            doctorAlreadyAccepted = true
          }
        })

        if (!userAlreadyRequested && !doctorAlreadyAccepted){
          Doctor.updateOne({_id: req.body.id}, {$push: {awaitingPatients: req.user}}, (err, result)=>{
            Patient.updateOne({_id: req.user.id}, {$push: {awaitingDoctors: doctorObject}}, (err, result)=>{
              res.redirect("/doctor-profile/" + req.body.id);
            })
          })
        }else{
          if (userAlreadyRequested){
            res.redirect("/home");
          }else if (doctorAlreadyAccepted){
            res.redirect("/home");
          }
        }
      })

    }else{
      res.redirect("/home");
    }
  }else{
    res.redirect("/login");
  }
})

module.exports = router;
