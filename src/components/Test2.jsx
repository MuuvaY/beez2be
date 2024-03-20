import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import sizeOf from "image-size";
import Resizer from "react-image-file-resizer";

import {
  faPhone,
  faLink,
  faEnvelope,
  faLocationDot,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

async function arrayBufferToBase64Images(imageData) {
  try {
    const base64ImagePromises = imageData.map(async (image) => {
      const binary = Array.from(new Uint8Array(image.data))
        .map((c) => String.fromCharCode(c))
        .join("");

      const resizedImage = await new Promise((resolve) => {
        Resizer.imageFileResizer(
          image.data,
          300, // Largeur désirée
          300, // Hauteur désirée
          "JPEG", // Format de sortie
          100, // Qualité de l'image
          0, // Rotation
          (uri) => {
            resolve(uri);
          },
          "base64"
        );
      });

      return resizedImage;
    });

    const base64Images = await Promise.all(base64ImagePromises);
    return base64Images;
  } catch (error) {
    console.error("Erreur lors de la conversion du tampon en base64:", error);
    throw new Error("Erreur lors de la conversion du tampon en base64");
  }
}

// function useWindowSize() {
//   const [windowSize, setWindowSize] = useState({
//     width: window.innerWidth,
//     height: window.innerHeight,
//   });

//   useEffect(() => {
//     const handleResize = () => {
//       setWindowSize({
//         width: window.innerWidth,
//         height: window.innerHeight,
//       });
//     };

//     // Attachez l'événement de redimensionnement à la fenêtre
//     window.addEventListener("resize", handleResize);

//     // Détachez l'événement lors du nettoyage du composant
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []); // Assurez-vous de n'attacher l'événement qu'une seule fois

//   return windowSize;
// }

// async function arrayBufferToBase64Images(imageData) {
//   try {
//     const base64ImagePromises = imageData.map(async (image) => {
//       try {
//         const blob = new Blob([image.data]);
//         if (blob.type.startsWith("image/")) {
//           const dataUrl = await new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onloadend = () => resolve(reader.result);
//             reader.onerror = reject;
//             reader.readAsDataURL(blob);
//           });

//           const resizedImage = await new Promise((resolve) => {
//             Resizer.imageFileResizer(
//               dataUrl,
//               300, // Set the desired width
//               300, // Set the desired height
//               "WEBP", // Set the format (JPEG, PNG, etc.)
//               100, // Set the quality (100 is maximum)
//               0, // Set the rotation angle
//               (uri) => {
//                 console.log("Resized image URI:", uri);
//               },
//               "base64" // Set the output type to base64
//             );
//           });

//           return resizedImage;
//         } else {
//           console.error(
//             "Error converting buffer to base64: Invalid image type"
//           );
//           throw new Error(
//             "Error converting buffer to base64: Invalid image type"
//           );
//         }
//       } catch (error) {
//         console.error("Error converting buffer to base64:", error);
//         throw new Error("Error converting buffer to base64");
//       }
//     });

//     const base64Images = await Promise.all(base64ImagePromises);
//     return base64Images;
//   } catch (error) {
//     console.error("Error converting buffer to base64:", error);
//     throw new Error("Error converting buffer to base64");
//   }
// }

// async function arrayBufferToBase64Images(imageData) {
//   try {
//     const base64ImagePromises = imageData.map(async (image) => {
//       const binary = Array.from(new Uint8Array(image.data))
//         .map((c) => String.fromCharCode(c))
//         .join("");
//       return btoa(binary);
//     });

//     const base64Images = await Promise.all(base64ImagePromises);
//     return base64Images;
//   } catch (error) {
//     console.error("Erreur lors de la conversion du tampon en base64:", error);
//     throw new Error("Erreur lors de la conversion du tampon en base64");
//   }
// }
// async function arrayBufferToBase64Logo(buffer) {
//   try {
//     const binary = Array.from(new Uint8Array(buffer))
//       .map((c) => String.fromCharCode(c))
//       .join("");
//     return btoa(binary);
//   } catch (error) {
//     console.error("Erreur lors de la conversion du tampon en base64:", error);
//     throw new Error("Erreur lors de la conversion du tampon en base64");
//   }
// }

function CompanyList({ entreprises }) {
  //   const [base64Images, setBase64Images] = useState([]);
  //   const [base64Logos, setBase64Logos] = useState([]);
  //   const { width } = useWindowSize();

  //   useEffect(() => {
  //     const fetchBase64ImagesAndLogos = async () => {
  //       try {
  //         const imagesAndLogosPromises = entreprises.map(async (entreprise) => {
  //           let base64Images = null;
  //           let base64Logos = null;

  //           if (entreprise.Image && entreprise.Image.length > 0) {
  //             base64Images = await arrayBufferToBase64Images(entreprise.Image);
  //           }

  //           if (entreprise.Logo && entreprise.Logo.data) {
  //             base64Logos = await arrayBufferToBase64Logo(entreprise.Logo.data);
  //           }

  //           return { base64Images, base64Logos };
  //         });

  //         const imagesAndLogos = await Promise.all(imagesAndLogosPromises);

  //         setBase64Images(imagesAndLogos.map((item) => item.base64Images));
  //         setBase64Logos(imagesAndLogos.map((item) => item.base64Logos));
  //       } catch (error) {
  //         console.error(error.message);
  //       }
  //     };

  //     fetchBase64ImagesAndLogos();
  //   }, [entreprises]);

  return (
    <>
      <div className="company company-list">
        <NavBar />
        <h1 className="text-center mt-8 text-2xl font-bold">Entreprises</h1>
      </div>
      <div>
        {entreprises.map((entreprise, index) => (
          <div
            key={entreprise.id}
            className="flex max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden m-4"
          >
            {/* Partie Gauche avec le carrousel */}
            <div className="w-1/2">
              {/* Utilisez ici un carrousel ou une galerie d'images */}
              {/* <div className="flex justify-center relative rounded-lg overflow-hidden"> */}
              <div>
                <div className=" inset-0">
                  {entreprise.Image &&
                  base64Images[index] &&
                  base64Images[index].length > 0 ? (
                    // Utilisez un carrousel ou une galerie pour afficher les images
                    <div>
                      {base64Images[index].map((base64Image, imageIndex) => (
                        <img
                          key={`image-${imageIndex}`}
                          src={`data:image/png;base64, ${base64Image}`}
                          alt={`Image de l'entreprise ${imageIndex + 1}`}
                          // className={`w-full h-auto ${
                          //   width > 768 ? "max-h-40" : "max-h-20"
                          // }`}
                        />
                      ))}
                    </div>
                  ) : (
                    <img
                      src="/default-placeholder.png"
                      alt="Image par défaut"
                      className="companyList-Image"
                    />
                  )}
                </div>
              </div>{" "}
            </div>
            {/* Ajoutez d'autres images ou utilisez un carrousel pour les images supplémentaires */}

            {/* Partie Droite avec les informations de l'entreprise */}
            <div className="w-1/2 p-6 flex flex-col">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900 my-1.5">
                  {entreprise.NomEntreprise}
                </h1>
                <div className="relative">
                  {entreprise.Logo && base64Logos[index] ? (
                    <img
                      src={`data:image/png;base64, ${base64Logos[index]}`}
                      alt="Logo de l'entreprise"
                      className="h-10 mr-2"
                    />
                  ) : (
                    <img
                      src="/default-placeholder.png"
                      alt="Logo par défaut"
                      className=" h-10 mr-2"
                    />
                  )}
                  <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-primary-red rounded-full"></span>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-4">
                {entreprise.Description}
              </p>
              <div className="grid grid-cols-2 grids-rows-2 gap-4">
                <p className="text-lg text-gray-600">
                  {" "}
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="companyList-icon inline-block w-5 h-5 xl:w-4 xl:h-4 mr-3 fill-current text-gray-800"
                  />
                  <a href={`tel:+33${entreprise.Tel}`}>{entreprise.Tel}</a>
                </p>
                <p className="text-lg text-gray-600">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="companyList-icon inline-block w-5 h-5 xl:w-4 xl:h-4 mr-3 fill-current text-gray-800"
                  />
                  <a href={`mailto:${entreprise.Email}`}>{entreprise.Email}</a>
                </p>
                <p className="text-lg text-gray-600">
                  <FontAwesomeIcon
                    icon={faTag}
                    className="companyList-icon inline-block w-5 h-5 xl:w-4 xl:h-4 mr-3 fill-current text-gray-800"
                  />
                  {entreprise.Tarif}
                </p>
                <p className="text-lg text-gray-600">
                  <a
                    href={entreprise.SiteWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    <FontAwesomeIcon
                      icon={faLink}
                      className="companyList-icon inline-block w-5 h-5 xl:w-4 xl:h-4 mr-3 fill-current text-gray-800"
                    />
                    {entreprise.SiteWeb}
                  </a>{" "}
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="companyList-icon inline-block w-5 h-5 xl:w-4 xl:h-4 mr-3 fill-current text-gray-800"
                  />
                  {entreprise.Adresse}
                </p>
              </div>
              <div className="col-span-2">
                <div
                  tabIndex={0}
                  className="collapse collapse-arrow border border-base-300 bg-base-200 cursor-pointer "
                >
                  <div className="companyList-horaire text-base font-medium">
                    Horaire
                  </div>

                  <div className="collapse-content">
                    <ul>
                      {entreprise.Status === "closed" ? (
                        <li key="closed" className="mt-2 xl:mt-0">
                          Fermé
                        </li>
                      ) : (
                        entreprise.Horaire.map((horaire, horaireIndex) => (
                          <li
                            key={horaire.id || `horaire-${horaireIndex}`}
                            className="mt-2 xl:mt-0"
                          >
                            {horaire.day} :{" "}
                            {horaire.status === "closed"
                              ? "Fermé"
                              : `${horaire.open} - ${horaire.close}`}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default CompanyList;
