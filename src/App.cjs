const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const entrepriseModel = require("./models/Entreprise.cjs");
const userModel = require("./models/Users.cjs");
const contactModel = require("./models/Contact.cjs");
const Avis = require("./models/Avis.cjs");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};

// mongoose.connect("mongodb://localhost:27017/Beez2Be", {
mongoose.connect(
  "mongodb+srv://myvart:vEhlcaeIDFmx55Ou@beez2be.soselie.mongodb.net/?retryWrites=true&w=majority&appName=beez2be",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.get("/entreprises", async (req, res) => {
  console.log("Requête get reçue pour /entreprises");
  try {
    const entreprises = await entrepriseModel.find();
    console.log("Entreprises récupérées avec succès:", entreprises);
    res.json(entreprises);
  } catch (err) {
    console.error("Erreur lors de la récupération des entreprises :", err);
    res.status(400).json("Error: " + err);
  }
});

app.post("/entreprises", async (req, res) => {
  console.log("Requête post reçue pour /entreprises");
  console.log("Données reçues :", req.body);

  // Convertir la chaîne base64 du logo en un buffer
  if (req.body.Logo && typeof req.body.Logo === "string") {
    const logoBase64 = req.body.Logo.split(",")[1]; // Récupère la partie base64
    req.body.Logo = Buffer.from(logoBase64, "base64");
  }
  if (req.body.Image && Array.isArray(req.body.Image)) {
    // Convertir chaque chaîne base64 en Buffer
    req.body.Image = req.body.Image.map((imageBase64) => {
      return Buffer.from(imageBase64.split(",")[1], "base64");
    });
  }
  // Récupérer l'ID de l'utilisateur à partir du corps de la requête
  const userId = req.body.userId;
  // Définir la propriété userId dans l'objet entreprise
  req.body.userId = userId;

  const nouvelleEntreprise = new entrepriseModel(req.body);

  try {
    const savedEntreprise = await nouvelleEntreprise.save();
    console.log("Entreprise ajoutée avec succès :", savedEntreprise);

    // Envoyer la réponse avec les détails de l'entreprise ajoutée
    res.json(savedEntreprise);
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'entreprise :", err);
    console.log("Erreurs de validation :", err.errors);
    res.status(400).json("Error: " + err);
  }
});

app.post("/users", async (req, res) => {
  const { email } = req.body;

  // Vérifier si l'adresse e-mail existe déjà dans la base de données
  const existingUser = await userModel.findOne({ email: email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Un compte existe déjà avec cette adresse e-mail" });
  }

  userModel
    .create(req.body)
    .then((users) => res.json(users))
    .catch((error) => res.json(error));
});

app.post("https://beez2be.vercel.app/login", async (req, res) => {
  const { email, password } = req.body;

  userModel.findOne({ email: email }).then((utilisateur) => {
    if (utilisateur) {
      bcrypt.compare(password, utilisateur.password, (err, result) => {
        if (err) {
          res.status(500).json({ success: false, message: "Erreur serveur" });
        } else if (result) {
          res.json({
            success: true,
            userId: utilisateur._id,
            statut: utilisateur.statut,
          });
        } else {
          res.json({ success: false, message: "Mot de passe incorrect" });
        }
      });
    } else {
      res.json({ success: false, message: "Pas de compte" });
    }
  });
});

app.get("/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log("UserID récupéré :", userId);

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des informations de l'utilisateur :",
      error
    );
    res.status(500).json({
      message:
        "Erreur serveur lors de la récupération des informations de l'utilisateur",
    });
  }
});

app.put("/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log("UserID récupéré :", userId);

  try {
    const updatedUser = await userModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des informations de l'utilisateur :",
      error
    );
    res.status(500).json({
      message:
        "Erreur serveur lors de la mise à jour des informations de l'utilisateur",
    });
  }
});

app.get("/users/:userId/companies", async (req, res) => {
  const userId = req.params.userId;
  console.log("UserID récupéré pour récupérer les entreprises :", userId);

  try {
    // Recherchez les entreprises associées à l'utilisateur spécifié
    const userCompanies = await entrepriseModel.find({ userId: userId });
    console.log("Entreprises associées à l'utilisateur :", userCompanies);

    res.json(userCompanies);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des entreprises de l'utilisateur :",
      error
    );
    res.status(500).json({
      message:
        "Erreur serveur lors de la récupération des entreprises de l'utilisateur",
    });
  }
});

app.put("/companies/:companyId", async (req, res) => {
  const companyId = req.params.companyId;
  console.log("ID de l'entreprise récupéré :", companyId);

  try {
    const updatedCompany = await entrepriseModel.findByIdAndUpdate(
      companyId,
      req.body,
      { new: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({ message: "Entreprise non trouvée" });
    }
    res.json(updatedCompany);
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des informations de l'entreprise :",
      error
    );
    res.status(500).json({
      message:
        "Erreur serveur lors de la mise à jour des informations de l'entreprise",
    });
  }
});

app.delete("/companies/:companyId", async (req, res) => {
  const companyId = req.params.companyId;

  try {
    // Chercher l'entreprise par son ID et la supprimer
    const deletedEntreprise = await entrepriseModel.findByIdAndDelete(
      companyId
    );

    if (!deletedEntreprise) {
      return res.status(404).json({ message: "Entreprise non trouvée" });
    }

    // Répondre avec succès si l'entreprise est supprimée avec succès
    res.json({ message: "Entreprise supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'entreprise :", error);
    res.status(500).json({
      message: "Erreur serveur lors de la suppression de l'entreprise",
    });
  }
});

app.post("/contact", async (req, res) => {
  const { email, sujet, message } = req.body;

  try {
    // Créer une nouvelle instance du modèle de contact avec les données du formulaire
    const newContact = new contactModel({ email, sujet, message });

    // Sauvegarder le nouveau contact dans la base de données
    const savedContact = await newContact.save();

    // Envoyer une réponse indiquant que le contact a été enregistré avec succès
    res
      .status(201)
      .json({ message: "Message envoyé avec succès", contact: savedContact });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du message :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de l'enregistrement du message" });
  }
});

// Route POST pour enregistrer un nouvel avis
app.post("/avis", async (req, res) => {
  // Extraire les données de l'avis depuis le corps de la requête
  const { fullName, rating, comment, entrepriseId } = req.body;

  try {
    // Créer une nouvelle instance de l'avis avec les données reçues
    const nouvelAvis = new Avis({
      fullName,
      rating,
      comment,
      entrepriseId,
    });

    // Enregistrer le nouvel avis dans la base de données
    const avisEnregistre = await nouvelAvis.save();

    // Répondre avec succès et renvoyer les détails de l'avis enregistré
    res
      .status(201)
      .json({ message: "Avis enregistré avec succès", avis: avisEnregistre });
  } catch (error) {
    // En cas d'erreur, répondre avec le code d'erreur 500 et un message d'erreur
    console.error("Erreur lors de l'enregistrement de l'avis :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de l'enregistrement de l'avis" });
  }
});

app.get("/avisentreprise/:entrepriseId", async (req, res) => {
  try {
    const entrepriseId = req.params.entrepriseId;
    // Requête pour récupérer les avis de l'entreprise spécifiée
    const avis = await Avis.find({ entrepriseId: entrepriseId });
    // Répondre avec les avis récupérés
    res.json(avis);
  } catch (error) {
    console.error("Erreur lors de la récupération des avis :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération des avis" });
  }
});

app.get("/avisentreprise/:entrepriseId/count", async (req, res) => {
  try {
    const { entrepriseId } = req.params;
    // Recherchez l'entreprise dans la base de données
    const entreprise = await Entreprise.findById(entrepriseId);
    if (!entreprise) {
      return res.status(404).json({ message: "Entreprise non trouvée" });
    }
    // Comptez le nombre d'avis pour cette entreprise
    const count = await Avis.countDocuments({ entrepriseId });
    // Renvoyez le nombre total d'avis dans la réponse
    res.json({ count });
  } catch (error) {
    console.error("Erreur lors de la récupération du nombre d'avis :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
