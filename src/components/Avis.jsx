import { Navbar } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "./NavBar";

function Avis() {
  const [fullName, setFullName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { entrepriseId } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Créer un objet contenant les données du formulaire
    const formData = {
      fullName,
      rating,
      comment,
      entrepriseId,
    };

    console.log("Données du formulaire :", formData);

    try {
      // Effectuer une requête POST vers l'API backend
      const response = await fetch("http://localhost:3001/avis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Vérifier si la requête a réussi
      if (response.ok) {
        console.log("Données envoyées avec succès !");
        // Réinitialiser le formulaire après soumission
        setFullName("");
        setRating(0);
        setComment("");
        window.location.href = "/avisentreprise";
      } else {
        console.error(
          "Erreur lors de l'envoi des données :",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données :", error.message);
    }
  };

  return (
    <>
      <NavBar />
      <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">
          Laissez un avis sur une entreprise
        </h2>
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="entrepriseId" value={entrepriseId} />
          <div className="mb-4">
            <label className="block mb-2">
              Nom et Prénom
              <input
                className="border w-full p-2 rounded-md"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block mb-2">
              Note:
              <select
                className="border w-full p-2 rounded-md"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                required
              >
                <option value={0}>--</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </label>
          </div>
          <div className="mb-4">
            <label className="block mb-2">
              Commentaire:
              <textarea
                className="border w-full p-2 rounded-md"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
            </label>
          </div>
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            type="submit"
          >
            Soumettre
          </button>
        </form>
      </div>
    </>
  );
}

export default Avis;
