const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate(v) {
      if (!validator.isEmail(v)) throw new Error("Email non valide");
    },
  },
  password: {
    type: String,
    required: true,
  },
  tel: {
    type: String,
    required: true,
  },
  statut: {
    type: String,
    required: true,
    enum: ["Professionnel", "Particulier"],
  },
  // Photo: {
  //   type: Buffer,
  // },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
