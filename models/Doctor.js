const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  licenseNumber: String,
  practiceName: String,
  phoneNumber: String,
  patientList: [],
  awaitingPatients: [],
  username: String, /*email*/
  password: String,
  authority: String
})

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
