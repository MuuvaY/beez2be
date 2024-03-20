// import React, { useState } from "react";
// import FileBase64 from "react-file-base64";

// const ImageUploader = () => {
//   const [base64Images, setBase64Images] = useState([]);

//   const handleFileUpload = (files) => {
//     const base64Array = files.map((file) => file.base64);
//     setBase64Images(base64Array);
//   };

//   const handleImageSubmit = () => {
//     // Envoyer base64Images vers le serveur ou effectuer toute autre opération
//     console.log("Images à envoyer en base64 :", base64Images);
//   };

//   return (
//     <div>
//       <FileBase64 multiple={true} onDone={handleFileUpload} />
//       <button onClick={handleImageSubmit}>Envoyer</button>
//     </div>
//   );
// };

// export default ImageUploader;

import React, { useState } from "react";
import FileBase64 from "react-file-base64";
import axios from "axios";

const ImageUploader = () => {
  const [base64Images, setBase64Images] = useState([]);

  const handleFileUpload = (files) => {
    const base64Array = files.map((file) => file.base64);
    setBase64Images(base64Array);
  };

  const handleImageSubmit = async () => {
    try {
      // Effectuer une requête POST vers le backend
      const response = await axios.post("http://localhost:3001/entreprises", {
        NomEntreprise: "CHEF",
        Description: "CHEF",
        Tel: "09 09 09 09 09",
        Email: "CHEF@CHEF.fr",
        Adresse: "CHEF",
        Tarif: "CHEF",
        SiteWeb: "CHEF",
        Image: base64Images,
        Horaire: Array.from({ length: 7 }, () => ({
          day: "11H",
          open: "12",
          close: "12",
          status: "open",
          // status: "",
          // Ajoutez d'autres données nécessaires ici
        })),
      });

      console.log("Réponse du serveur :", response.data);
    } catch (error) {
      console.error("Erreur lors de l'envoi des images :", error);
    }
  };

  return (
    <div>
      <FileBase64 multiple={true} onDone={handleFileUpload} />
      <button onClick={handleImageSubmit}>Envoyer</button>
    </div>
  );
};

export default ImageUploader;
