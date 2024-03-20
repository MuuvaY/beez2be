import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyAccount() {
  const [userInfo, setUserInfo] = useState(null);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [statut, setStatut] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("userId from localStorage:", userId);
    if (!userId) {
      navigate("/login");
    } else {
      axios
        .get(`http://localhost:3001/users/${userId}`)
        .then((response) => {
          setUserInfo(response.data);
          setNom(response.data.nom);
          setPrenom(response.data.prenom);
          setEmail(response.data.email);
          setTel(response.data.tel);
          setStatut(response.data.statut);
        })
        .catch((error) => {
          console.log(
            "Erreur lors de la récupération des informations de l'utilisateur :",
            error
          );
        });
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    axios
      .put(`http://localhost:3001/users/${userId}`, {
        nom,
        prenom,
        email,
        tel,
        statut,
      })
      .then((response) => {
        setUserInfo(response.data);
        setErrorMessage("");
        setEditing(false);
      })
      .catch((error) => {
        setErrorMessage("Échec de la mise à jour des informations.");
        console.log("Erreur lors de la mise à jour des informations :", error);
      });
  };

  const updateStatut = (newStatut) => {
    setStatut(newStatut);
  };

  return (
    <div>
      <NavBar />
      {/* <div className="bg-blue-100 border border-blue-200 rounded p-4"> */}

      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 mt-8 ">
        <h1 className="text-2xl font-bold mb-4">Mon compte</h1>
        {editing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="bg-blue-100 border border-blue-200 rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold mb-4">
                  Informations personnelles
                </h2>
                <div className="mb-2">
                  <label htmlFor="nom" className="font-bold">
                    Nom :
                  </label>
                  <input
                    type="text"
                    id="nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="nom" className="font-bold">
                    Prénom :
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="nom" className="font-bold">
                    Email :
                  </label>
                  <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="nom" className="font-bold">
                    Nom :
                  </label>
                  <input
                    type="tel"
                    id="tel"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="statut" className="font-bold">
                    Statut :
                  </label>
                  <div>
                    <input
                      name="statut"
                      id="professionnel"
                      type="radio"
                      value="Professionnel"
                      checked={statut === "Professionnel"}
                      onChange={(e) => setStatut(e.target.value)}
                    />
                    <label htmlFor="professionnel">Professionnel</label>
                  </div>
                  <div>
                    <input
                      name="statut"
                      id="particulier"
                      type="radio"
                      value="Particulier"
                      checked={statut === "Particulier"}
                      onChange={(e) => setStatut(e.target.value)}
                    />
                    <label htmlFor="particulier">Particulier</label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Sauvegarder
                </button>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              </div>
            </div>
          </form>
        ) : (
          <div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="bg-blue-100 border border-blue-200 rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold mb-4">
                  Informations personnelles
                </h2>
                <p className="mb-2">
                  <span className="font-bold">Nom:</span>{" "}
                  {userInfo && userInfo.nom}
                </p>
                <p className="mb-2">
                  <span className="font-bold">Email:</span>{" "}
                  {userInfo && userInfo.email}
                </p>
                <p className="mb-2">
                  <span className="font-bold">Téléphone:</span>{" "}
                  {userInfo && userInfo.tel}
                </p>
                <p className="mb-2">
                  <span className="font-bold">Statut:</span>{" "}
                  {userInfo && userInfo.statut}
                </p>
                <button
                  onClick={() => setEditing(true)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAccount;
