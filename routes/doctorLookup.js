const express = require("express");
const router = express.Router();

const Doctor = require("../models/Doctor");

router.get("/:keyword", async (req, res)=>{
  const keyword = req.params.keyword.toLowerCase()
  const splitKeyword = keyword.split(" ");

  const relevantDoctors = [];

  const arrayOfDoctors = await Doctor.find({});

  arrayOfDoctors.forEach(doctorObject=>{
    if (splitKeyword.length == 1){
      if (keyword == doctorObject.firstName.toLowerCase()){
        relevantDoctors.push(doctorObject)
      }else if (keyword == doctorObject.lastName.toLowerCase()){
        relevantDoctors.push(doctorObject)
      }else if (req.params.keyword == doctorObject._id){
        relevantDoctors.push(doctorObject)
      }
    }else if (splitKeyword.length == 2){
      if (keyword == doctorObject.firstName.toLowerCase() + doctorObject.lastName.toLowerCase()){
        relevantDoctors.push(doctorObject);
      }else if (keyword == doctorObject.practiceName.toLowerCase()){
        relevantDoctors.push(doctorObject);
      }
    }else{
      if (keyword == doctorObject.practiceName.toLowerCase()){
        relevantDoctors.push(doctorObject);
      }
    }
  })

  if (req.isAuthenticated()){
    if (req.user.authority == "Patient"){
      res.render("DoctorLookup", {
        title: "Doctor Lookup | Clearview Health",
        doctor: false,
        patient: true,
        relevantDoctors: relevantDoctors
      })
    }else{
      res.render("DoctorLookup", {
        title: "Doctor Lookup | Clearview Health",
        doctor: true,
        patient: false,
        relevantDoctors: relevantDoctors
      })
    }
  }else{
    res.render("DoctorLookup", {
      title: "Doctor Lookup | Clearview Health",
      doctor: false,
      patient: false,
      relevantDoctors: relevantDoctors
    })
  }

})


module.exports = router;
