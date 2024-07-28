const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

router.post("/", async (req, res)=>{
  if (req.isAuthenticated()){
    if (req.user.authority == "Patient"){
      console.log(req.user);
      const doctorObject = await Doctor.findOne({_id: req.body.id});

      let userAlreadyRequested = false
      let doctorAlreadyAccepted = false

      doctorObject.awaitingPatients.forEach(element=>{
        if (element.id == req.user.id){
          userAlreadyRequested = true
        }
      })

      doctorObject.patientList.forEach(element=>{
        if (element._id.equals(new mongoose.Types.ObjectId(req.user.id))){ /*DO NOT PUSH YET: change = new*/
          doctorAlreadyAccepted = true
        }
      })

      if (!userAlreadyRequested && !doctorAlreadyAccepted){
        await Doctor.updateOne({_id: req.body.id}, {$push: {awaitingPatients: req.user}});
        await Patient.updateOne({_id: req.user.id}, {$push: {awaitingDoctors: doctorObject}});
        res.redirect("/doctor-profile/" + req.body.id);
      }else{
        if (userAlreadyRequested){
          res.redirect("/home");
        }else if (doctorAlreadyAccepted){
          res.redirect("/home");
        }
      }


    }else{
      res.redirect("/home");
    }
  }else{
    res.redirect("/login");
  }
})

module.exports = router;
