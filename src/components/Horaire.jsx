import React, { useState } from "react";
import Modal from "react-modal";

const Horaire = ({ setHoraireSelected, updateBusinessHours }) => {
  const [businessHours, setBusinessHours] = useState({
    Lundi: { status: "open", open: "", close: "" },
    Mardi: { status: "open", open: "", close: "" },
    Mercredi: { status: "open", open: "", close: "" },
    Jeudi: { status: "open", open: "", close: "" },
    Vendredi: { status: "open", open: "", close: "" },
    Samedi: { status: "open", open: "", close: "" },
    Dimanche: { status: "open", open: "", close: "" },
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selected, setSelected] = useState(false);

  const handleChange = (day, field, value) => {
    setBusinessHours((prevBusinessHours) => ({
      ...prevBusinessHours,
      [day]: {
        ...prevBusinessHours[day],
        [field]: value,
      },
    }));
  };
  const handleSave = (e) => {
    e.preventDefault();

    // Format des horaires pour la mise à jour dans CompanyForm
    const formattedHours = Object.entries(businessHours).map(
      ([day, hours]) => ({
        day,
        open: hours.open || "",
        close: hours.close || "",
        status: hours.status,
      })
    );
    console.log("Formatted Hours:", formattedHours);

    // Appelez la fonction updateBusinessHours avec les horaires formatés
    updateBusinessHours(formattedHours);
    closeModal();
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const handleSelection = (selectedHours) => {
    // Mettez à jour l'état local ou effectuez d'autres actions si nécessaire
    updateBusinessHours(selectedHours);
    // Mettez à jour l'état pour indiquer que des horaires ont été sélectionnés
    setHoraireSelected(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={`h-10 border mt-1 rounded px-4 w-full ${
          selected ? "bg-green-100" : "bg-gray-50"
        } hover:bg-gray-100 focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out`}
      >
        {selected
          ? "Horaires sélectionnés"
          : "Ajouter des horaires d'ouverture"}
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Business Hours Form"
      >
        <div className="max-w-3xl mx-auto mt-4 p-2 rounded bg-gray-100 shadow-md">
          <h1 className="text-lg mb-2 font-bold text-black-700">
            Gestion des horaires
          </h1>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(businessHours).map(([day, hours]) => (
              <div key={day} className="p-4 border rounded-md bg-white">
                <label
                  htmlFor={`${day}-status`}
                  className="block font-semibold capitalize text-gray-800 mb-1"
                >
                  {day}:
                </label>
                <select
                  id={`${day}-status`}
                  value={hours.status}
                  onChange={(e) => handleChange(day, "status", e.target.value)}
                  className="border p-2 rounded focus:outline-none focus:border-blue-500 text-sm w-full"
                >
                  <option value="open">Ouvert</option>
                  <option value="closed">Fermé</option>
                </select>
                {hours.status === "open" && (
                  <div className="mt-2 space-y-2">
                    <label
                      htmlFor={`${day}-open`}
                      className="block font-semibold text-gray-800 text-sm"
                    >
                      Ouverture:
                    </label>
                    <input
                      type="time"
                      id={`${day}-open`}
                      value={hours.open}
                      onChange={(e) =>
                        handleChange(day, "open", e.target.value)
                      }
                      className="border p-2 rounded focus:outline-none focus:border-blue-500 text-sm w-full"
                    />
                    <label
                      htmlFor={`${day}-close`}
                      className="block font-semibold text-gray-800 text-sm"
                    >
                      Fermeture:
                    </label>
                    <input
                      type="time"
                      id={`${day}-close`}
                      value={hours.close}
                      onChange={(e) =>
                        handleChange(day, "close", e.target.value)
                      }
                      className="border p-2 rounded focus:outline-none focus:border-blue-500 text-sm w-full"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
          >
            Enregistrer
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Horaire;
