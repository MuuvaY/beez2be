import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Horaire from "./Horaire";
import AncienHoraire from "./AncienHoraire";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faLink,
  faEnvelope,
  faLocationDot,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

function MyAccount({ updateUserStatut }) {
  const [userInfo, setUserInfo] = useState(null);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [statut, setStatut] = useState("");
  const [siteWeb, setSiteWeb] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const [userCompanies, setUserCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [editedCompany, setEditedCompany] = useState({});
  const [tempStatut, setTempStatut] = useState(statut);
  const [editedCompanyHours, setEditedCompanyHours] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    // console.log("userId from localStorage:", userId);
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
          setSiteWeb(response.data.siteWeb);
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
        statut: tempStatut,
        siteWeb,
      })
      .then((response) => {
        setUserInfo(response.data);
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        setErrorMessage("");
        setEditing(false);
        setStatut(tempStatut);
        localStorage.setItem("Statut", tempStatut);
        window.location.reload();
      })
      .catch((error) => {
        setErrorMessage("Échec de la mise à jour des informations.");
        console.log("Erreur lors de la mise à jour des informations :", error);
      });
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    axios
      .get(`http://localhost:3001/users/${userId}/companies`)
      .then((response) => {
        setUserCompanies(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des entreprises :",
          error
        );
        setIsLoading(false);
      });
  }, []);

  const handleEditCompany = (company) => {
    console.log("Anciens horaires de l'entreprise :", company.Horaire);
    setEditedCompany(company);
    setEditingCompanyId(company._id);
    setEditedCompanyHours(company.Horaire);
  };

  const handleCancelEdit = () => {
    setEditingCompanyId(null);
    setEditedCompany({});
    setEditedCompanyHours([]);
  };

  // const handleSubmitEdit = (e) => {
  //   e.preventDefault();
  //   console.log("Editing company ID:", editingCompanyId); // Ajout du log pour vérifier l'ID de l'entreprise en cours d'édition
  //   console.log("Edited company data:", editedCompany); // Ajout du log pour vérifier les données de l'entreprise modifiées
  //   axios
  //     .put(`http://localhost:3001/companies/${editingCompanyId}`, {
  //       ...editedCompany,
  //       Horaire: editedCompanyHours,
  //     })
  //     .then((response) => {
  //       console.log("Update company response:", response.data); // Ajout du log pour afficher la réponse de la requête de mise à jour de l'entreprise
  //       setUserCompanies((prevCompanies) =>
  //         prevCompanies.map((company) =>
  //           company._id === editingCompanyId ? response.data : company
  //         )
  //       );
  //       setEditingCompanyId(null);
  //       setEditedCompany({});
  //       setEditedCompanyHours([]);
  //     })
  //     .catch((error) => {
  //       console.error("Erreur lors de la mise à jour de l'entreprise :", error);
  //     });
  // };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    console.log("Editing company ID:", editingCompanyId);
    console.log("Edited company data:", editedCompany);
    axios
      .put(`http://localhost:3001/companies/${editingCompanyId}`, {
        ...editedCompany,
        Horaire: editedCompanyHours,
      })
      .then((response) => {
        console.log("Update company response:", response.data);
        setUserCompanies((prevCompanies) =>
          prevCompanies.map((company) =>
            company._id === editingCompanyId ? response.data : company
          )
        );
        setEditingCompanyId(null);
        setEditedCompany({});
        setEditedCompanyHours([]);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour de l'entreprise :", error);
      });
  };

  const handleDeleteCompany = (companyId) => {
    console.log(
      "Tentative de suppression de l'entreprise avec l'ID :",
      companyId
    );
    axios
      .delete(`http://localhost:3001/companies/${companyId}`)
      .then((response) => {
        setUserCompanies((prevCompanies) =>
          prevCompanies.filter((company) => company._id !== companyId)
        );
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de l'entreprise :", error);
        // Gérer les erreurs de suppression
      });
  };

  const handleStatutChange = (e) => {
    setTempStatut(e.target.value);
  };

  // useEffect(() => {
  //   const storedStatut = localStorage.getItem("Statut");
  //   if (storedStatut) {
  //     setStatut(storedStatut);
  //   }
  // }, []);

  // console.log("je teste le statut", statut);

  useEffect(() => {
    if (userInfo) {
      setStatut(userInfo.statut);
    }
  }, [userInfo]);

  const updateBusinessHours = (hours) => {
    setEditedCompanyHours(hours);
  };

  return (
    <div>
      <NavBar statut={statut} setUserStatut={setStatut} />
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
                    Téléphone :
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
                      // onChange={(e) => setStatut(e.target.value)}
                      onChange={handleStatutChange}
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
                      // onChange={(e) => setStatut(e.target.value)}
                      onChange={handleStatutChange}
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
                  <span className="font-bold">Nom :</span>{" "}
                  {userInfo && userInfo.nom}
                </p>
                <p className="mb-2">
                  <span className="font-bold">Email :</span>{" "}
                  {userInfo && userInfo.email}
                </p>
                <p className="mb-2">
                  <span className="font-bold">Téléphone :</span>{" "}
                  {userInfo && userInfo.tel}
                </p>
                <p className="mb-2">
                  <span className="font-bold">Statut :</span>{" "}
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
            <div className="container mx-auto mt-10">
              <h1 className="text-2xl font-bold mb-4">Mes entreprises</h1>
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> */}
              {editingCompanyId === editedCompany._id ? (
                <form onSubmit={handleSubmitEdit}>
                  <div className="bg-blue-100 border border-blue-200 rounded-lg shadow-md p-6">
                    <div className="mb-2">
                      <label>Nom de l'entreprise</label>
                      <input
                        type="text"
                        name="full_name"
                        id="full_name"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        value={editedCompany.NomEntreprise}
                        onChange={(e) =>
                          setEditedCompany((prevCompany) => ({
                            ...prevCompany,
                            NomEntreprise: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mb-2">
                      <label htmlFor="description">Description :</label>
                      <textarea
                        id="description"
                        value={editedCompany.Description}
                        onChange={(e) =>
                          setEditedCompany((prevCompany) => ({
                            ...prevCompany,
                            Description: e.target.value,
                          }))
                        }
                        className="h-40 border mt-1 rounded px-4 w-full bg-gray-50 resize-none"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label>Email</label>
                      <input
                        type="text"
                        name="full_name"
                        id="full_name"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        value={editedCompany.Email}
                        onChange={(e) =>
                          setEditedCompany((prevCompany) => ({
                            ...prevCompany,
                            Email: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label>Téléphone</label>
                      <input
                        type="text"
                        name="full_name"
                        id="full_name"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        value={editedCompany.Tel}
                        onChange={(e) =>
                          setEditedCompany((prevCompany) => ({
                            ...prevCompany,
                            Tel: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mb-2">
                      <label>Ville</label>
                      <input
                        type="text"
                        name="full_name"
                        id="full_name"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        value={editedCompany.Adresse}
                        onChange={(e) =>
                          setEditedCompany((prevCompany) => ({
                            ...prevCompany,
                            Adresse: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mb-2">
                      <label>Site web</label>
                      <input
                        type="text"
                        name="full_name"
                        id="full_name"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        value={editedCompany.SiteWeb}
                        onChange={(e) =>
                          setEditedCompany((prevCompany) => ({
                            ...prevCompany,
                            SiteWeb: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <AncienHoraire
                      setHoraire={(hours) => setEditedCompanyHours(hours)}
                      updateBusinessHours={updateBusinessHours}
                      oldBusinessHours={editedCompanyHours}
                    />

                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-3"
                    >
                      Sauvegarder
                    </button>
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3"
                      onClick={handleCancelEdit}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  {userCompanies.length === 0 ? (
                    <p>Aucune entreprise trouvée. Veuillez en ajouter une.</p>
                  ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {userCompanies.map((company) => (
                        <li key={company._id}>
                          <div className="w-full  p-6 flex flex-col bg-blue-100 border border-blue-200 rounded-lg shadow-md p-6 mb-8">
                            <div className="flex items-center justify-between">
                              <h1 className="text-2xl font-semibold text-gray-900 my-1.5">
                                {company.NomEntreprise}
                              </h1>
                            </div>
                            <p className="text-lg text-gray-600 mb-4">
                              {company.Description}
                            </p>
                            <div className="grid grid-cols-2 grids-rows-2 gap-4">
                              <p className="text-lg text-gray-600">
                                <FontAwesomeIcon
                                  icon={faPhone}
                                  className="companyList-icon inline-block w-5 h-5 xl:w-4 xl:h-4 mr-3 fill-current text-gray-800"
                                />
                                <a href={`tel:+33${company.Tel}`}>
                                  {company.Tel}
                                </a>
                              </p>
                              <p className="text-lg text-gray-600">
                                <FontAwesomeIcon
                                  icon={faEnvelope}
                                  className="companyList-icon inline-block w-5 h-5 xl:w-4 xl:h-4 mr-3 fill-current text-gray-800"
                                />
                                <a href={`mailto:${company.Email}`}>
                                  {company.Email}
                                </a>
                              </p>
                              {/* <p className="text-lg text-gray-600">
                                <FontAwesomeIcon
                                  icon={faTag}
                                  className="companyList-icon inline-block w-5 h-5 xl:w-4 xl:h-4 mr-3 fill-current text-gray-800"
                                />
                                {company.Tarif}
                              </p> */}
                              <p className="text-lg text-gray-600">
                                <a
                                  href={company.SiteWeb}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 underline"
                                >
                                  <FontAwesomeIcon
                                    icon={faLink}
                                    className="companyList-icon inline-block w-5 h-5 xl:w-4 xl:h-4 mr-3 fill-current text-gray-800"
                                  />
                                  {company.SiteWeb}
                                </a>
                              </p>
                              <p className="text-lg text-gray-600 mb-4">
                                <FontAwesomeIcon
                                  icon={faLocationDot}
                                  className="companyList-icon inline-block w-5 h-5 xl:w-4 xl:h-4 mr-3 fill-current text-gray-800"
                                />
                                {company.Adresse}
                              </p>
                            </div>
                            <div className="col-span-2 mb-3">
                              <div
                                tabIndex={0}
                                className="collapse collapse-arrow border border-base-300 bg-base-200 cursor-pointer "
                              >
                                <div className="companyList-horaire text-base font-medium">
                                  Horaire
                                </div>
                                <div className="collapse-content">
                                  <ul>
                                    {company.Status === "closed" ? (
                                      <li key="closed" className="mt-2 xl:mt-0">
                                        Fermé
                                      </li>
                                    ) : (
                                      company.Horaire.map(
                                        (horaire, horaireIndex) => (
                                          <li
                                            key={
                                              horaire.id ||
                                              `horaire-${horaireIndex}`
                                            }
                                            className="mt-2 xl:mt-0"
                                          >
                                            {horaire.day} :{" "}
                                            {horaire.status === "closed"
                                              ? "Fermé"
                                              : `${horaire.open} - ${horaire.close}`}
                                          </li>
                                        )
                                      )
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="flex 	">
                              <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                onClick={() => handleEditCompany(company)}
                              >
                                Modifier
                              </button>
                              <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                onClick={() => {
                                  console.log(
                                    "Cliqué sur Supprimer pour l'entreprise avec l'ID :",
                                    company._id
                                  );
                                  handleDeleteCompany(company._id);
                                }}
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAccount;
