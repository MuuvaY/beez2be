const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const entrepriseModel = require("./models/Entreprise.cjs");
const userModel = require("./models/Users.cjs");

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

mongoose.connect("mongodb://localhost:27017/Beez2Be", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  userModel.findOne({ email: email }).then((utilisateur) => {
    if (utilisateur) {
      bcrypt.compare(password, utilisateur.password, (err, result) => {
        if (err) {
          res.status(500).json({ success: false, message: "Erreur serveur" });
        } else if (result) {
          res.json({ success: true, userId: utilisateur._id });
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
