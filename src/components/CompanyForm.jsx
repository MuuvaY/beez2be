import React, { useState } from "react";
import NavBar from "./NavBar";
import Horaire from "./Horaire";
import FileBase64 from "react-file-base64";
import axios from "axios";
import Resizer from "react-image-file-resizer";

function CompanyForm({
  ajouterEntreprise,
  nouvelleEntreprise,
  setNouvelleEntreprise,
}) {
  const [horaireSelected, setHoraireSelected] = useState(false);
  const [base64Images, setBase64Images] = useState([]); // Utiliser un tableau pour stocker les images
  const [errors, setErrors] = useState({});

  const handleFileUpload = async (files) => {
    try {
      const resizedImages = await Promise.all(
        files.map(async (file) => {
          // Convertir la représentation base64 en Blob
          const blob = await fetch(file.base64).then((res) => res.blob());

          // Redimensionner l'image avec react-image-file-resizer
          const resizedImage = await new Promise((resolve) => {
            Resizer.imageFileResizer(
              blob, // Passer l'objet Blob
              500, // Largeur désirée
              300, // Hauteur désirée
              "WEBP", // Format de sortie
              100, // Qualité de l'image
              0, // Rotation
              (uri) => {
                resolve(uri);
              },
              "base64" // Format de sortie
            );
          });
          console.log(
            "Format de l'image de sortie :",
            resizedImage.substring(5, 15)
          );

          return resizedImage;
        })
      );

      // Stocker les images redimensionnées dans le state
      setBase64Images(resizedImages);
    } catch (error) {
      console.error("Erreur lors du redimensionnement des images :", error);
    }
  };

  const handleAjouterEntreprise = async (e) => {
    e.preventDefault();

    // Vérifiez si les champs obligatoires sont renseignés
    if (
      nouvelleEntreprise.Tel &&
      nouvelleEntreprise.Description &&
      nouvelleEntreprise.SiteWeb &&
      nouvelleEntreprise.Email &&
      nouvelleEntreprise.NomEntreprise &&
      nouvelleEntreprise.Tarif &&
      nouvelleEntreprise.Horaire
    ) {
      // Format des horaires pour l'envoi au backend
      const formattedHours = nouvelleEntreprise.Horaire.map(
        ({ day, open, close, status }) => ({
          day,
          open,
          close,
          status,
        })
      );

      // Créez un nouvel objet avec les horaires correctement formatés et les images
      const newData = {
        ...nouvelleEntreprise,
        Horaire: formattedHours,
        Image: base64Images, // Utilisez le tableau d'images
      };

      console.log("Données avant envoi :", newData);

      // Envoyer newData au backend
      try {
        const response = await axios.post(
          "http://localhost:3001/entreprises",
          newData
        );
        console.log("Réponse du serveur :", response.data);
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'entreprise :", error);
      }
    } else {
      // Gérez le cas où les champs obligatoires ne sont pas remplis
      console.error("Veuillez remplir tous les champs obligatoires");
    }
  };

  return (
    <>
      <NavBar />
      {/* <form onSubmit={handleAjouterEntreprise} encType="multipart/form-data"> */}
      <form encType="multipart/form-data">
        <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center company">
          <div className="container max-w-screen-lg mx-auto">
            <div>
              <div className="bg-blue-100 border border-blue-200 rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                  <div className="text-gray-600">
                    <p className="text-black text-lg font-bold">
                      Ajouter une entreprise
                    </p>
                    <p>Merci</p>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                      <div className="md:col-span-5">
                        <label>Nom de l'entreprise</label>
                        <input
                          type="text"
                          name="full_name"
                          id="full_name"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          value={nouvelleEntreprise.NomEntreprise || ""}
                          onChange={(e) =>
                            setNouvelleEntreprise({
                              ...nouvelleEntreprise,
                              NomEntreprise: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="md:col-span-5">
                        <label>Description</label>
                        <textarea
                          id="description"
                          name="description"
                          className="h-40 border mt-1 rounded px-4 w-full bg-gray-50 resize-none"
                          value={nouvelleEntreprise.Description || ""}
                          onChange={(e) =>
                            setNouvelleEntreprise({
                              ...nouvelleEntreprise,
                              Description: e.target.value,
                            })
                          }
                        ></textarea>
                      </div>

                      <div className="md:col-span-3">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          value={nouvelleEntreprise.Email || ""}
                          onChange={(e) =>
                            setNouvelleEntreprise({
                              ...nouvelleEntreprise,
                              Email: e.target.value,
                            })
                          }
                          placeholder="email@domaine.com"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label>Téléphone</label>
                        <input
                          type="tel"
                          name="telephone"
                          id="telephone"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          pattern="[0-9]{10}"
                          value={nouvelleEntreprise.Tel || ""}
                          onChange={(e) =>
                            setNouvelleEntreprise({
                              ...nouvelleEntreprise,
                              Tel: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label>Ville</label>
                        <input
                          type="text"
                          name="adresse"
                          id="adresse"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          pattern="[0-9]{10}"
                          value={nouvelleEntreprise.Adresse || ""}
                          onChange={(e) =>
                            setNouvelleEntreprise({
                              ...nouvelleEntreprise,
                              Adresse: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label>Site web</label>
                        <input
                          type="text"
                          name="siteweb"
                          id="siteweb"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          value={nouvelleEntreprise.SiteWeb || ""}
                          placeholder="https://www.example.com"
                          onChange={(e) =>
                            setNouvelleEntreprise({
                              ...nouvelleEntreprise,
                              SiteWeb: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label>Tarifs</label>
                        <input
                          type="text"
                          name="Tarif"
                          id="Tarif"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          value={nouvelleEntreprise.Tarif || ""}
                          onChange={(e) =>
                            setNouvelleEntreprise({
                              ...nouvelleEntreprise,
                              Tarif: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label>Horaire d'ouverture</label>
                        <div>
                          <Horaire
                            setHoraireSelected={setHoraireSelected}
                            updateBusinessHours={(hours) =>
                              setNouvelleEntreprise({
                                ...nouvelleEntreprise,
                                Horaire: hours,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="md:col-span-3">
                        <label>Logo</label>
                        <div className="border mt-1 rounded w-full bg-gray-50">
                          <FileBase64
                            multiple={false}
                            accept="image/*"
                            onDone={({ base64 }) =>
                              setNouvelleEntreprise({
                                ...nouvelleEntreprise,
                                Logo: base64, // This is the base64-encoded file
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="md:col-span-3">
                        <label>Images</label>
                        <div className=" border mt-1 rounded w-full bg-gray-50">
                          <FileBase64
                            multiple={true} // Permet l'upload de plusieurs images
                            accept="image/*"
                            onDone={handleFileUpload}
                          />
                        </div>
                      </div>
                      <div className="md:col-span-5 text-right">
                        <div className="inline-flex items-end">
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={(e) => handleAjouterEntreprise(e)}
                          >
                            Ajouter Entreprise
                          </button>
                        </div>
                      </div>

                      <div className="md:col-span-5 text-right">
                        <div className="inline-flex items-end"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default CompanyForm;
