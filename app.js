require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();

mongoose.connect("mongodb+srv://tacobellcommercial:"+process.env.PASSWORD+"@cluster0.0zda3uf.mongodb.net/")

const Patient = require("./models/Patient")
const Doctor = require("./models/Doctor")

const patientStrategy = require("./strategies/patientStrategy");
const doctorStrategy = require("./strategies/doctorStrategy");

const patientSignupRouter = require("./routes/patientSignup");
const patientLoginRouter = require("./routes/patientLogin");

const doctorSignupRouter = require("./routes/doctorSignup");
const doctorLoginRouter = require("./routes/doctorLogin");

const landingPageRouter = require("./routes/landingPage");
const doctorLookupRouter = require("./routes/doctorLookup");
const doctorProfileRouter = require("./routes/doctorProfile");
const requestDoctorRouter = require("./routes/requestDoctor");

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static("public"));

app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: true
}))

app.use(passport.authenticate("session"));


passport.use("patientStrategy", patientStrategy);
passport.use("doctorStrategy", doctorStrategy);

passport.serializeUser((user, callback)=>{
  if (user.authority == "Doctor"){
    process.nextTick(()=>{
      callback(null, {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        licenseNumber: user.licenseNumber,
        phoneNumber: user.phoneNumber,
        username: user.username,
        authority: user.authority
      })
    })
  }else{
    process.nextTick(()=>{
      callback(null, {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        biologicalSex: user.biologicalSex,
        username: user.username,
        authority: user.authority
      })
    })
  }

})

passport.deserializeUser((user, callback)=>{
  process.nextTick(()=>{
    return callback(null, user);
  })
})

app.use("/patient-sign-up", patientSignupRouter); /*POST*/
app.use("/patient-login", patientLoginRouter); /*POST*/

app.use("/doctor-sign-up", doctorSignupRouter); /*POST */
app.use("/doctor-login", doctorLoginRouter); /*POST */


app.use("/", landingPageRouter); /*GET*/

app.get("/home", async (req, res)=>{
  if (req.isAuthenticated()){
    if (req.user.authority == "Doctor"){
      function calculateAge(dateString) {
          var today = new Date();
          var birthDate = new Date(dateString);
          var age = today.getFullYear() - birthDate.getFullYear();
          var m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              age--;
          }
          return age;
      }
      const doctorObject = await Doctor.findOne({_id: req.user.id})
      res.render("DoctorHome", {
        title: "Doctor Home | Clearview Health",
        firstName: doctorObject.firstName,
        lastName: doctorObject.lastName,
        patientList: doctorObject.patientList,
        awaitingPatients: doctorObject.awaitingPatients,
        calculateAge: calculateAge,
        doctor: true,
        patient: false
      });

    }else if (req.user.authority == "Patient"){
      res.render("PatientHome", {
        title: "Patient Home | Clearview Health",
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        doctor: false,
        patient: true
      });
    }
  }else{
    res.redirect("/");
  }
})

function authorizedDoctor(doctorObject, stringPatientId){
  let authorized = false;
  doctorObject.patientList.forEach(patient=>{
    if (patient._id.equals(mongoose.Types.ObjectId(stringPatientId))){
      authorized = true;
    }
  })
  return authorized;
}

/*PRESCRIPTIONS*/
/*PRESCRIPTIONS*/
/*PRESCRIPTIONS*/

app.get("/prescriptions/:userId", async (req, res)=>{
  if (req.isAuthenticated()){
    if (req.user.authority == "Patient"){
      if (req.user.id == req.params.userId){
        res.render("PatientPrescriptions", {
          title: "Your prescriptions | Clearview Health"
        })
      }else{
        res.redirect("/");
      }
    }else if (req.user.authority == "Doctor"){
      const doctorObject = await Doctor.findOne({_id: req.user.id});

      let authorized = authorizedDoctor(doctorObject, req.params.userId)

      if (authorized){
        const patientObject = await Patient.findOne({_id: req.params.userId})
        console.log("HELKRLOSJFDKLEDFS");
        console.log(patientObject);
        res.render("DoctorPrescriptions", {
          title: "Patient prescriptions | Clearview Health",
          prescriptionList: patientObject.prescriptionList,
          doctor: true,
          patient: false,
          patientId: req.params.userId
        });
      }else{
        res.redirect("/home");
      }
    }
  }else{
    res.redirect("/");
  }
})

app.post("/add-prescription", async (req, res)=>{
  if (req.isAuthenticated()){
    if (req.user.authority == "Doctor"){
      const doctorObject = await Doctor.findOne({_id: req.user.id});
      let authorized = authorizedDoctor(doctorObject, req.body.patientId);

      if (authorized){
        const prescriptionObject = {prescritionName: req.body.prescriptionName, prescriptionAmount: req.body.prescriptionAmount, time: req.body.prescriptionTime}
        await Patient.updateOne({_id: req.body.patientId}, {$push: {prescriptionList: prescriptionObject}})
        res.redirect("/prescriptions/" + req.body.patientId)
      }else{
        res.redirect("/home");
      }
    }else{
      res.redirect("/home");
    }
  }else{
    res.redirect("/home");
  }
})


/*END OF PRESCRIPTIONS*/

app.post("/doctor-accept-patient", async (req, res)=>{
  const doctorObject = await Doctor.findOne({_id: req.user.id})
  const patientObject = await Patient.findOne({_id: req.body.id});

  await Patient.updateOne({_id: req.body.id}, {$pull: {awaitingDoctors: {_id: mongoose.Types.ObjectId(req.user.id)}}});
  await Patient.updateOne({_id: req.body.id}, {$push: {doctorsList: doctorObject}});

  await Doctor.updateOne({_id: req.user.id}, {$pull: {awaitingPatients: {id: req.body.id}}});
  await Doctor.updateOne({_id: req.user.id}, {$push: {patientList: patientObject}})
  res.redirect("/home");
})

app.post("/doctor-reject-patient", (req, res)=>{
  Doctor.updateOne({_id: req.user.id}, {$pull: {awaitingPatients: {id: req.body.id}}}, (err, result)=>{
    Patient.updateOne({_id: req.body.id}, {$pull: {awaitingDoctors: {_id: mongoose.Types.ObjectId(req.user.id)}}}, (err2, result2)=>{
      res.redirect("/home");
    })
  })
})



app.use("/doctor-search", doctorLookupRouter) /*GET*/

app.post("/doctor-search", (req, res)=>{
  const keyword = req.body.keyword
  res.redirect("/doctor-search/" + keyword);
})

app.use("/doctor-profile", doctorProfileRouter); /*GET*/

app.use("/request-doctor", requestDoctorRouter); /*POST*/


app.get("/login", (req, res)=>{
  if (!req.isAuthenticated()){
    res.render("Login", {
      title: "Login | Clearview Health",
      doctor: false,
      patient: false,
      errorMessage: "",
    });
  }else{
    res.redirect("/home");
  }
})

app.get("/register", (req, res)=>{
  if (!req.isAuthenticated()){
    res.render("Register", {
      title: "Register | Clearview Health",
      doctor: false,
      patient: false,
      errorMessage: "",
      successMessage: ""
    })
  }else{
    res.redirect("/home");
  }
})

app.post("/logout", (req, res)=>{
  req.logout(err=>{
    res.redirect("/");
  })
})


app.listen(3000, ()=>{
  console.log("Listening on port 3000");
})
