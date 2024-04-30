// Exemple d'utilisation du contexte pour stocker les entreprises
// dans votre application
// EntrepriseContext.js

import React, { createContext, useState } from "react";

export const EntrepriseContext = createContext();

export const EntrepriseProvider = ({ children }) => {
  const [entreprises, setEntreprises] = useState([]);

  return (
    <EntrepriseContext.Provider value={{ entreprises, setEntreprises }}>
      {children}
    </EntrepriseContext.Provider>
  );
};

export default EntrepriseContext;
