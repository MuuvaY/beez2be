const mongoose = require("mongoose");
const validator = require("validator");

const entrepriseSchema = mongoose.Schema({
  NomEntreprise: {
    type: String,
    required: true,
    validate(v) {
      if (validator.isEmpty(v))
        throw new Error("Veuillez renseigner le nom de l'entreprise");
    },
  },
  Description: {
    type: String,
    required: true,
    validate(v) {
      if (validator.isEmpty(v))
        throw new Error("Veuillez renseigner la description de l'entreprise");
    },
  },
  Tel: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    validate(v) {
      if (!validator.isEmail(v)) throw new Error("Email non valide");
    },
  },
  // Tarif: {
  //   type: String,
  //   required: true,
  // },
  SiteWeb: {
    type: String,
    required: true,
  },
  Adresse: {
    type: String,
    required: true,
  },
  Logo: {
    type: Buffer,
  },
  Image: [
    {
      type: Buffer,
    },
  ],
  Horaire: [
    {
      day: {
        type: String,
        required: true,
      },
      open: {
        type: String,
        // required: true,
      },
      close: {
        type: String,
        // required: true,
      },
      status: {
        type: String,
        required: true,
      },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Référence au modèle d'utilisateur
    required: true,
  },
});

entrepriseSchema.pre("save", function (next) {
  const validationErrors = this.validateSync();
  if (validationErrors) {
    console.error("Erreurs de validation :", validationErrors.errors);
    next(new Error("Erreur de validation"));
  } else {
    next();
  }
});

const entrepriseModel = mongoose.model("Entreprise", entrepriseSchema);

module.exports = entrepriseModel;
