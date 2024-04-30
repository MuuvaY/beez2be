import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { Link, useParams } from "react-router-dom";
import { Footer } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Carousel } from "flowbite-react";
import Avis from "./Avis";
import axios from "axios";

import {
  faPhone,
  faLink,
  faEnvelope,
  faLocationDot,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Attachez l'événement de redimensionnement à la fenêtre
    window.addEventListener("resize", handleResize);

    // Détachez l'événement lors du nettoyage du composant
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Assurez-vous de n'attacher l'événement qu'une seule fois

  return windowSize;
}

async function arrayBufferToBase64Images(imageData) {
  try {
    const base64ImagePromises = imageData.map(async (image) => {
      const binary = Array.from(new Uint8Array(image.data))
        .map((c) => String.fromCharCode(c))
        .join("");
      return btoa(binary);
    });

    const base64Images = await Promise.all(base64ImagePromises);
    return base64Images;
  } catch (error) {
    console.error("Erreur lors de la conversion du tampon en base64:", error);
    throw new Error("Erreur lors de la conversion du tampon en base64");
  }
}
async function arrayBufferToBase64Logo(buffer) {
  try {
    const binary = Array.from(new Uint8Array(buffer))
      .map((c) => String.fromCharCode(c))
      .join("");
    return btoa(binary);
  } catch (error) {
    console.error("Erreur lors de la conversion du tampon en base64:", error);
    throw new Error("Erreur lors de la conversion du tampon en base64");
  }
}

function CompanyList({ entreprises, avis }) {
  const [base64Images, setBase64Images] = useState([]);
  const [base64Logos, setBase64Logos] = useState([]);
  const { width } = useWindowSize();
  const [avisCounts, setAvisCounts] = useState({});

  const [currentSlides, setCurrentSlides] = useState(
    JSON.parse(localStorage.getItem("currentSlides")) ||
      Array(entreprises.length).fill(0)
  );

  // Mettre à jour l'état des diapositives dans le stockage local à chaque changement
  useEffect(() => {
    localStorage.setItem("currentSlides", JSON.stringify(currentSlides));
  }, [currentSlides]);

  useEffect(() => {
    const fetchBase64ImagesAndLogos = async () => {
      try {
        const imagesAndLogosPromises = entreprises.map(async (entreprise) => {
          let base64Images = null;
          let base64Logos = null;

          if (entreprise.Image && entreprise.Image.length > 0) {
            base64Images = await arrayBufferToBase64Images(entreprise.Image);
          }

          if (entreprise.Logo && entreprise.Logo.data) {
            base64Logos = await arrayBufferToBase64Logo(entreprise.Logo.data);
          }

          return { base64Images, base64Logos };
        });

        const imagesAndLogos = await Promise.all(imagesAndLogosPromises);

        setBase64Images(imagesAndLogos.map((item) => item.base64Images));
        setBase64Logos(imagesAndLogos.map((item) => item.base64Logos));
      } catch (error) {
        console.error("Error fetching base64 images and logos:", error);
      }
    };

    fetchBase64ImagesAndLogos();
  }, [entreprises]);

  const previousSlide = (index) => {
    setCurrentSlides((prevSlides) => {
      const newSlides = [...prevSlides];
      newSlides[index] =
        newSlides[index] === 0
          ? base64Images[index].length - 1
          : newSlides[index] - 1;
      return newSlides;
    });
  };

  // Function to handle changing to the next slide for a specific company
  const nextSlide = (index) => {
    setCurrentSlides((prevSlides) => {
      const newSlides = [...prevSlides];
      newSlides[index] =
        newSlides[index] === base64Images[index].length - 1
          ? 0
          : newSlides[index] + 1;
      return newSlides;
    });
  };

  useEffect(() => {
    const fetchAvisCounts = async () => {
      try {
        const counts = {}; // Initialize counts object
        // Iterate through each entreprise
        for (const entreprise of entreprises) {
          // Fetch the total number of avis for the current entreprise
          const response = await fetch(
            `http://localhost:3001/avisentreprise/${entreprise._id}`
          );
          if (response.ok) {
            const avisData = await response.json();
            counts[entreprise._id] = avisData.length; // Store the count
          } else {
            console.error("Error fetching avis count:", response.statusText);
          }
        }
        // Update the state with counts object
        setAvisCounts(counts);
      } catch (error) {
        console.error("Error fetching avis counts:", error);
      }
    };

    fetchAvisCounts();
  }, [entreprises]);

  return (
    <>
      <div className="company company-list">
        <NavBar />
      </div>
      <div className="mx-auto my-8 px-4">
        <h1 className="text-center text-2xl font-bold">Entreprises</h1>
        {entreprises.map((entreprise, index) => (
          <div
            key={entreprise.id}
            className="flex flex-col md:flex-row max-w-4xl mx-auto bg-blue-100 border border-blue-200 shadow-lg rounded-lg overflow-hidden m-4"
          >
            <div className="carousel w-3/6">
              {base64Images[index] && base64Images[index].length > 0 ? (
                base64Images[index].map((base64Image, imageIndex) => (
                  <div
                    key={`slide-${imageIndex}`}
                    className={`carousel-item relative w-full`}
                    style={{
                      display:
                        currentSlides[index] === imageIndex ? "block" : "none",
                    }}
                  >
                    <img
                      src={`data:image/*;base64,${base64Image}`}
                      alt={`Image ${imageIndex}`}
                      className="w-96 h-96 object-contain mx-auto"
                    />
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                      <button
                        onClick={() => previousSlide(index)}
                        className="btn btn-circle"
                        disabled={currentSlides[index] === 0}
                      >
                        ❮
                      </button>
                      <button
                        onClick={() => nextSlide(index)}
                        className="btn btn-circle"
                        disabled={
                          currentSlides[index] ===
                          base64Images[index].length - 1
                        }
                      >
                        ❯
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="carousel-item relative w-full">
                  <img
                    src="/default-placeholder.png"
                    alt="Image par défaut"
                    className="w-full"
                  />
                </div>
              )}
            </div>
            <div className="w-3/6  p-6 flex flex-col">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900 my-1.5">
                  {entreprise.NomEntreprise}
                </h1>
                <div className="relative">
                  {entreprise.Logo && base64Logos[index] ? (
                    <img
                      src={`data:image/*;base64,${base64Logos[index]}`}
                      alt="Logo de l'entreprise"
                      className="h-10 mr-2"
                    />
                  ) : (
                    <img
                      src="/default-placeholder.png"
                      alt="Logo par défaut"
                      className="h-10 mr-2"
                    />
                  )}
                  <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-primary-red rounded-full"></span>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-4 break-words">
                {entreprise.Description}
              </p>
              <div className="grid grid-cols-2 grids-rows-2 gap-4">
                <p className="text-lg text-gray-600">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="companyList-icon inline-block w-5 h-5 xl:w-4 xl:h-4 mr-3 fill-current text-gray-800"
                  />
                  <a className="underline" href={`tel:+33${entreprise.Tel}`}>
                    {entreprise.Tel}
                  </a>
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="companyList-icon inline-block w-5 h-5 xl:w-4 xl:h-4 mr-3 fill-current text-gray-800"
                  />
                  {entreprise.Adresse}
                </p>
              </div>
              <div>
                <p className="text-lg text-gray-600 break-words mb-4">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="companyList-icon inline-block w-5 h-5 xl:w-4 xl:h-4 mr-3 fill-current text-gray-800"
                  />
                  <a className="underline" href={`mailto:${entreprise.Email}`}>
                    {entreprise.Email}
                  </a>
                </p>
                <p className="text-lg text-gray-600 mb-4">
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
                  </a>
                </p>
              </div>
              <div className="grid grid-cols-2 grids-rows-2 gap-4 ">
                <div className="flex items-center">
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
                <div className="flex items-center">
                  <p className="text-lg text-gray-600">
                    <Link to={`/avisentreprise/${entreprise._id}`}>
                      Voir les avis ({avisCounts[entreprise._id] || 0})
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}

export default CompanyList;
