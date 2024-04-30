import React, { useState } from "react";
import axios from "axios";
// import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";

import NavBar from "./NavBar";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const hashedPassword = await bcrypt.hash(password, 10);
    axios
      .post("http://localhost:3001/login", {
        email,
        password,
      })
      .then((result) => {
        // console.log(result);
        if (result.data.success) {
          setIsLoggedIn(true);
          navigate("/");
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userId", result.data.userId);

          const { statut } = result.data; // Assurez-vous que votre backend renvoie le statut de l'utilisateur
          localStorage.setItem(
            "userInfo",
            JSON.stringify({ ...result.data, statut })
          );
        }
      })
      .catch((error) => console.log(error));
  };

  localStorage.setItem("isLoggedIn", "true");
  localStorage.removeItem("isLoggedIn");

  return (
    <div>
      <NavBar />
      <div className="w-full flex items-center justify-center mt-20">
        <form
          className="bg-blue-100 border border-blue-200 shadow-md rounded px-8 pt-6 pb-8 mb-4 grid grid-cols-2 gap-6"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-bold text-center text-gray-700 col-span-2">
            Content de te revoir
          </h1>
          <div className="col-span-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              E-mail
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="nom@beez2be.fr"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="col-span-2 flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Connexion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
