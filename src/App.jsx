import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "preline/preline";
import axios from "axios";
import CompanyList from "./components/CompanyList";
import CompanyForm from "./components/CompanyForm";
import Horaire from "./components/Horaire";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import NavBar from "./components/NavBar";
import MyAccount from "./components/MyAccount";
import Contact from "./components/Contact";
import Avis from "./components/Avis";
import AvisEntreprise from "./components/AvisEntreprise";

function App() {
  const [entreprise, setEntreprise] = useState([]);
  const [nouvelleEntreprise, setNouvelleEntreprise] = useState({
    NomEntreprise: "",
    Description: "",
    Tel: "",
    Email: "",
    Image: [],
    Adresse: "",
    SiteWeb: "",
    Logo: "",
    Horaire: Array.from({ length: 7 }, () => ({
      day: "",
      open: "",
      close: "",
      status: "open",
      // status: "",
    })),
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  // const [userStatut, setUserStatut] = useState("");
  const [statut, setStatut] = useState("");

  const chargerEntreprises = () => {
    axios
      .get("http://localhost:3001/entreprises")
      // .get("/entreprises")
      .then((entreprise) => {
        // console.log("Entreprises chargées avec succès:", entreprise.data);
        setEntreprise(entreprise.data);
      })
      .catch((err) =>
        console.log("Erreur lors du chargement des entreprises :", err)
      );
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/entreprises")
      // .get("/entreprises")
      .then((entreprise) => {
        setEntreprise(entreprise.data);
      })
      .catch((err) =>
        console.log(
          "Erreur lors du chargement des entreprises lors du montage :",
          err
        )
      );
    chargerEntreprises();
  }, []);

  const ajouterEntreprise = async (e, data) => {
    e.preventDefault();
    console.log("Données envoyées depuis le formulaire :", data);

    // Format des horaires pour l'envoi au backend
    const formattedHours = data.Horaire.map(({ day, open, close, status }) => ({
      day,
      open,
      close,
      status,
    }));

    // Créez un nouvel objet avec les horaires correctement formatés
    const newData = {
      ...data,
      Horaire: formattedHours,
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/entreprises",
        newData
      );
      // const response = await axios.post(
      //   "/entreprises",
      //   newData
      // );
      console.log("Response from POST request:", response.data);

      setEntreprise([...entreprise, response.data]);

      // Réinitialiser le formulaire ou effectuer d'autres actions nécessaires
      setNouvelleEntreprise({
        NomEntreprise: "",
        Description: "",
        Tel: "",
        Email: "",
        Image: [],
        Adresse: "",
        SiteWeb: "",
        Logo: "",
        Horaire: Array.from({ length: 7 }, () => ({
          day: "",
          open: "",
          close: "",
          status: "open",
          // status: "",
        })),
      });

      // Mettez à jour les entreprises après l'ajout
      chargerEntreprises();
    } catch (error) {
      console.log("Erreur lors de la requête POST :", error.response.data);
    }
  };

  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem("userInfo");
    if (userInfoFromStorage) {
      setUserInfo(JSON.parse(userInfoFromStorage));
    }
  }, []);

  // Fonction pour mettre à jour userInfo
  const updateUserInfo = (data) => {
    setUserInfo(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
  };

  useEffect(() => {
    const storedUserStatut = localStorage.getItem("statut");
    if (storedUserStatut) {
      setStatut(storedUserStatut);
    }
  }, []);

  // Fonction pour mettre à jour le statut de l'utilisateur
  const updateStatut = (newStatut) => {
    setStatut(newStatut);
    localStorage.setItem("statut", newStatut); // Stocker le statut de l'utilisateur dans le localStorage
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            // path="/"
            element={
              <NavBar
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                userInfo={userInfo}
                statut={statut}
                updateStatut={updateStatut}
              />
            }
          />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
          <Route
            path="/companyList"
            element={<CompanyList entreprises={entreprise} />}
          />
          <Route
            path="/companyForm"
            element={
              <CompanyForm
                ajouterEntreprise={(e, data) => ajouterEntreprise(e, data)}
                nouvelleEntreprise={nouvelleEntreprise}
                setNouvelleEntreprise={setNouvelleEntreprise}
              />
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/myaccount"
            element={
              <MyAccount userInfo={userInfo} updateStatut={updateStatut} />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                setIsLoggedIn={setIsLoggedIn}
                updateUserInfo={updateUserInfo}
              />
            }
          />{" "}
          <Route
            path="/register"
            element={<Register setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/avis/:entrepriseId" element={<Avis />} />
          <Route
            path="/avisentreprise/:entrepriseId"
            element={<AvisEntreprise />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
