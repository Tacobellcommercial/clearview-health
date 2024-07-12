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

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static("public"));

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.authenticate("session"));


passport.use("patientStrategy", patientStrategy);
passport.use("doctorStrategy", doctorStrategy);

passport.serializeUser((user, callback)=>{
  process.nextTick(()=>{
    callback(null, {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      licenseNumber: user.licenseNumber,
      phoneNumber: user.phoneNumber,
      patientList: user.patientList,
      username: user.username,
      authority: user.authority
    })
  })
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

app.get("/home", (req, res)=>{
  if (req.isAuthenticated()){
    if (req.user.authority == "Doctor"){
      console.log(req.user);
      console.log(req.user.patientList);
      res.render("DoctorHome", {
        title: "Doctor Home | Clearview Health",
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        patientList: req.user.patientList,
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

app.use("/doctor-search", doctorLookupRouter) /*GET*/

app.post("/doctor-search", (req, res)=>{
  const keyword = req.body.keyword
  res.redirect("/doctor-search/" + keyword);
})

app.get("/doctor-profile/:id", (req, res)=>{
  const id = req.params.id;

  Doctor.findOne({_id: id}, (err, result)=>{
    if (!result){
      console.log("Error...")
      res.redirect("/home");
    }else if (result){
      if (req.isAuthenticated()){
        res.render("DoctorProfile", {
          title: "Doctor Profile | Clearview Health",
          doctor: req.authority == "Doctor",
          patient: req.authority == "Patient"
        })
      }else{
        res.render("DoctorProfile", {
          title: "Doctor Profile | Clearview Health",
          doctor: false,
          patient: false
        })
      }
    }
  })
})


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
