const mongoose = require("mongoose");


const patientSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
  dateOfBirth: String,
  biologicalSex: String,
  doctorsList: [],
  awaitingDoctors: [],
  username: String,
  password: String,
  authority: String
})

const Patient = mongoose.model("Patient", patientSchema)

module.exports = Patient;
