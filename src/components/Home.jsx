import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

function Home() {
  return (
    <div>
      <NavBar />
      <div className="container mx-auto flex flex-col lg:flex-row">
        <div className="lg:w-1/2 bg-gray-200 p-8 flex items-center justify-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Connectez-vous à l'expertise avec Beez2Be !
            </h1>
            <p className="text-lg mb-4">
              Beez2Be est une plateforme innovante qui transforme la façon dont
              les professionnels se connectent aux utilisateurs, en offrant un
              pont unique entre les experts et ceux qui recherchent leurs
              services.
            </p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Commencer
            </button>
          </div>
        </div>
        <div className="lg:w-1/2">
          <img
            src="/default-placeholder.png"
            alt="Description de l'image"
            className="w-full h-auto"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
