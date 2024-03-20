import React, { useState } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

function Register({ setIsLoggedIn }) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tel, setTel] = useState("");
  const [statut, setStatut] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const errors = [];

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const checkExistingEmail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users?email=${email}`
      );
      return response.data.length > 0;
    } catch (error) {
      console.error("Error checking existing email:", error);
      return false;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas.");
      return;
    }

    const emailExists = await checkExistingEmail();
    if (emailExists) {
      setEmailError("Cet email est déjà utilisé.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    axios
      .post("http://localhost:3001/users", {
        nom,
        prenom,
        email,
        tel,
        statut,
        password: hashedPassword,
      })
      .then((result) => {
        console.log(result);
        handleLogin();
        navigate("/login");
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setEmailError(error.response.data.message); // Afficher le message d'erreur spécifique à l'email
        } else {
          console.error("Error creating user:", error);
          // Gérer les autres erreurs ici
        }
      });
  };

  const handleEmailChange = () => {
    setEmailError("");
    setErrorMessage("");
  };

  const handlePasswordChange = () => {
    setPasswordError("");
    setErrorMessage("");
  };

  return (
    <div>
      <NavBar />
      <div className="flex items-center justify-center mt-20">
        <form
          className="bg-blue-100 border border-blue-200 shadow-md rounded px-8 pt-6 pb-8 mb-4 grid grid-cols-2 gap-6"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-bold text-center text-gray-700 col-span-2">
            Créer un compte
          </h1>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nom
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Nom"
              onChange={(e) => setNom(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Prénom
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Prénom"
              onChange={(e) => setPrenom(e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Adresse Mail
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              placeholder="nom@beez2be.fr"
              onChange={(e) => {
                setEmail(e.target.value);
                handleEmailChange();
              }}
            />
            {emailError && (
              <p className="text-red-500 text-xs italic">{emailError}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Téléphone
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="tel"
              placeholder="XX XX XX XX XX"
              onChange={(e) => setTel(e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Statut
            </label>
            <div className="flex items-center">
              <input
                name="statut"
                type="radio"
                value="Professionnel"
                onChange={(e) => setStatut(e.target.value)}
              />
              <label className="mr-4">Professionnel</label>
              <input
                name="statut"
                type="radio"
                value="Particulier"
                onChange={(e) => setStatut(e.target.value)}
              />
              <label>Particulier</label>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mot de passe
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              autoComplete="current-password"
              onChange={(e) => {
                setPassword(e.target.value);
                handlePasswordChange();
              }}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirmez le mot de passe
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              autoComplete="current-password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordError && (
              <p className="text-red-500 text-xs italic">{passwordError}</p>
            )}
          </div>
          <div className="col-span-2 flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Créer un compte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
