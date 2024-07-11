const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  authority: String
})

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
