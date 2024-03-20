import React, { useState, useEffect } from "react";

function ImageLoader({ imageData }) {
  const [base64Image, setBase64Image] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const binary = Array.from(new Uint8Array(imageData.data))
          .map((c) => String.fromCharCode(c))
          .join("");
        const base64 = btoa(binary);
        setBase64Image(base64);
      } catch (error) {
        console.error("Erreur lors du chargement de l'image :", error);
      }
    };

    fetchImage();
  }, [imageData]);

  return base64Image ? (
    <img
      src={`data:image/*;base64, ${base64Image}`}
      alt={`Image de l'entreprise`}
    />
  ) : null;
}

export default ImageLoader;
