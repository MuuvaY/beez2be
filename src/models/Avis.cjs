const mongoose = require("mongoose");

const AvisSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    entrepriseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entreprise", // Assurez-vous que cela correspond au nom de votre modèle d'entreprise
    },
  },
  { timestamps: true }
);

const Avis = mongoose.model("Avis", AvisSchema);

module.exports = Avis;
