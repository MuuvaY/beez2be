const mongoose = require("mongoose");
const validator = require("validator");

const contactSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate(v) {
      if (!validator.isEmail(v)) throw new Error("Email non valide");
    },
  },
  sujet: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const contactModel = mongoose.model("Contact", contactSchema);

module.exports = contactModel;
