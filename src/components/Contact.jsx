import React, { useState } from "react";
import NavBar from "./NavBar";
import axios from "axios";

function Contact() {
  const [formData, setFormData] = useState({
    email: "",
    sujet: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/contact",
        formData
      );
      setSuccessMessage(response.data.message);
      setErrorMessage("");
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("Erreur lors de l'envoi du message");
    }
    setSubmitting(false);
    setFormData({
      email: "",
      sujet: "",
      message: "",
    });
  };

  return (
    <>
      <NavBar />
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
            Contactez-nous{" "}
          </h2>
          <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
            Vous avez un problème technique ? Vous souhaitez envoyer des
            commentaires sur une fonctionnalité bêta ? Besoin de détails sur
            notre plan Business ? Faites le nous savoir.
          </p>
          <form className="space-y-8" onSubmit={handleSubmit}>
            {submitting && (
              <div className="text-center">
                <p>Envoi en cours...</p>
              </div>
            )}
            {successMessage && (
              <div className="text-center">
                <p style={{ color: "green" }}>{successMessage}</p>
              </div>
            )}
            {errorMessage && (
              <div className="text-center">
                <p style={{ color: "red" }}>{errorMessage}</p>
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Votre email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                placeholder="nom@beez2be.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Sujet
              </label>
              <input
                type="text"
                id="subject"
                name="sujet"
                value={formData.sujet}
                onChange={handleChange}
                className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                placeholder="Dites-nous comment nous pouvons vous aider"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
              >
                Votre message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Laissez un commentaire"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-black py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Envoyer le message
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default Contact;
