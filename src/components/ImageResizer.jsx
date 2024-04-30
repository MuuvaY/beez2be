// import React, { useState } from "react";
// import Resizer from "react-image-file-resizer";
// import axios from "axios";

// const ImageResizer = () => {
//   const [originalSize, setOriginalSize] = useState(null);
//   const [originalFormat, setOriginalFormat] = useState(null);
//   const [resizedSize, setResizedSize] = useState(null);
//   const [resizedFormat, setResizedFormat] = useState(null);
//   const [resizedImageData, setResizedImageData] = useState(null); // Ajout de la variable d'état pour les données de l'image redimensionnée

//   const handleImageUpload = async (event) => {
//     const file = event.target.files[0];

//     // Stocker la taille et le format de l'image originale
//     setOriginalSize(file.size);
//     setOriginalFormat(file.type);

//     Resizer.imageFileResizer(
//       file,
//       300,
//       300,
//       "JPEG",
//       100,
//       0,
//       async (uri, format) => {
//         // Stocker la taille et le format de l'image redimensionnée
//         setResizedSize(uri.length);
//         setResizedFormat(format);
//         setResizedImageData(uri); // Stocker les données de l'image redimensionnée dans la variable d'état
//       },
//       "base64",
//       300,
//       300
//     );
//   };

//   const handleImageSend = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("image", resizedImageData);
//       const response = await axios.post(
//         "http://localhost:3001/entreprises",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data", // Ajoutez ce header pour indiquer que vous envoyez un formulaire avec des fichiers
//           },
//         }
//       );
//       console.log("Image envoyée avec succès !");
//       console.log(
//         "URL de l'image dans la base de données :",
//         response.data.imageUrl
//       );
//     } catch (error) {
//       console.error("Erreur lors de l'envoi de l'image :", error);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleImageUpload} />
//       {originalSize && (
//         <p>
//           Taille de l'image originale : {originalSize} octets, Format :{" "}
//           {originalFormat}
//         </p>
//       )}
//       {resizedSize && (
//         <p>
//           Taille de l'image redimensionnée : {resizedSize} octets, Format :{" "}
//           {resizedFormat}
//         </p>
//       )}
//       {resizedSize && (
//         <button onClick={handleImageSend}>Envoyer l'image</button>
//       )}
//     </div>
//   );
// };

// export default ImageResizer;
