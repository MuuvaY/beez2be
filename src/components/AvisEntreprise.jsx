import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import NavBar from "./NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  // Récupérer les composants de la date
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  const hour = ("0" + date.getHours()).slice(-2);
  const minute = ("0" + date.getMinutes()).slice(-2);

  // Formater la date et l'heure
  return `${day}/${month}/${year} à ${hour}h${minute}`;
}

function AvisEntreprise() {
  const { entrepriseId } = useParams();
  const [avis, setAvis] = useState([]);
  const [moyenneAvis, setMoyenneAvis] = useState(null);

  useEffect(() => {
    const fetchAvis = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/avisentreprise/${entrepriseId}`
        );
        if (response.ok) {
          const avisData = await response.json();
          setAvis(avisData);

          // Calcul de la moyenne des avis
          const moyenne =
            avisData.reduce((total, avisItem) => total + avisItem.rating, 0) /
            avisData.length;
          setMoyenneAvis(moyenne.toFixed(1)); // Arrondi à une décimale
        } else {
          console.error(
            "Erreur lors de la récupération des avis :",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des avis :", error);
      }
    };

    fetchAvis();
  }, [entrepriseId]);

  return (
    <div>
      <NavBar />
      <div className="flex place-content-evenly items-center mb-8 mt-4">
        <Link to="/companyList" className="text-blue-500 text-lg mr-4">
          <FontAwesomeIcon className="mr-2" icon={faArrowLeft} />
          Retour
        </Link>
        <Link
          to={`/avis/${entrepriseId}`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Ajouter un avis
        </Link>
      </div>

      <div className="max-w-lg mx-auto mt-8 px-4">
        <h2 className="text-2xl font-semibold mb-4 mt-4">
          Avis sur l'entreprise
        </h2>

        {avis.length === 0 ? (
          <p className="text-gray-600">Aucun avis disponible pour le moment.</p>
        ) : (
          <div>
            {moyenneAvis !== null && (
              <p className="text-gray-600">
                Moyenne des avis : {moyenneAvis}/5
              </p>
            )}
            {avis.map((avisItem, avisIndex) => (
              <div
                key={avisIndex}
                className="border border-gray-200 rounded-lg p-4 mb-4"
              >
                <p className="text-black font-medium">{avisItem.fullName}</p>
                <p className="text-gray-700 mb-2 text-sm text-base">
                  {formatDateTime(avisItem.createdAt)}
                </p>{" "}
                <p className="text-gray-700 mb-2">Note : {avisItem.rating}/5</p>
                <p className="text-gray-600">{avisItem.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AvisEntreprise;
