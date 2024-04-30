import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

function NavBar({ statut, updateUserStatut }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [userStatut, setUserStatut] = useState("");

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem("userInfo");

    if (userInfoFromStorage) {
      const parsedUserInfo = JSON.parse(userInfoFromStorage);
      setUserInfo(parsedUserInfo);
      setUserStatut(parsedUserInfo.statut);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false); // Simulate logout
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userId");
    navigate("/");
  };

  console.log("Navbar", location.pathname);

  return (
    <header>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo à gauche */}
            <div className="flex-shrink-0">
              <NavLink to="/" className="flex items-center">
                <svg
                  className="h-10 w-10 mr-2"
                  width="51"
                  height="70"
                  viewBox="0 0 51 70"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                ></svg>
                <span className="text-lg font-semibold whitespace-nowrap">
                  Beez2Be{" "}
                </span>
              </NavLink>
            </div>
            {/* Éléments cliquables au centre */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink
                  to="/"
                  className={`text-gray-500 hover:text-gray-900 ${
                    location.pathname === "/" ? "text-blue-500" : ""
                  }`}
                >
                  Accueil
                </NavLink>

                {/* <li
                  className={`hover:text-blue-500 ${
                    location.pathname === "/" ? "text-blue-500" : ""
                  }`}
                >
                  <NavLink to="/">Accueil </NavLink>
                </li> */}
                <NavLink
                  to="/companyList"
                  className={`text-gray-500 hover:text-gray-900 ${
                    location.pathname === "/companyList" ? "text-blue-500" : ""
                  }`}
                >
                  Entreprises
                </NavLink>
                {userStatut === "Professionnel" && (
                  <NavLink
                    to="/companyForm"
                    className={`text-gray-500 hover:text-gray-900 ${
                      location.pathname === "/companyForm"
                        ? "text-blue-500"
                        : ""
                    }`}
                  >
                    Ajouter entreprise
                  </NavLink>
                )}
                <NavLink
                  to="/contact"
                  className={`text-gray-500 hover:text-gray-900 ${
                    location.pathname === "/contact" ? "text-blue-500" : ""
                  }`}
                >
                  Contact
                </NavLink>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {isLoggedIn ? (
                  <>
                    <NavLink
                      to="/myaccount"
                      className={`text-gray-500 hover:text-gray-900 ${
                        location.pathname === "/myaccount"
                          ? "text-blue-500"
                          : ""
                      }`}
                    >
                      Mon compte
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="ml-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Se déconnecter
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className={`text-gray-500 hover:text-gray-900 ${
                        location.pathname === "/login" ? "text-blue-500" : ""
                      }`}
                    >
                      Connexion
                    </NavLink>
                    <NavLink
                      to="/register"
                      className={`ml-4 text-gray-500 hover:text-gray-900 ${
                        location.pathname === "/register" ? "text-blue-500" : ""
                      }`}
                    >
                      Inscription
                    </NavLink>
                  </>
                )}
              </div>
            </div>
            {/* Bouton de menu mobile */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMobileMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/"
                  ? "text-blue-500 bg-gray-50"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Accueil
            </NavLink>
            <NavLink
              to="/companyList"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/companyList"
                  ? "text-blue-500 bg-gray-50"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Entreprises
            </NavLink>
            {userStatut === "Professionnel" && (
              <NavLink
                to="/companyForm"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === "/companyForm"
                    ? "text-blue-500 bg-gray-50"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Ajouter entreprise
              </NavLink>
            )}
            <NavLink
              to="/contact"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/contact"
                  ? "text-blue-500 bg-gray-50"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Contact
            </NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              {isLoggedIn ? (
                <>
                  <div className="text-base font-medium text-gray-800">
                    <NavLink
                      to="/myaccount"
                      className={`text-gray-500 hover:text-gray-900 ${
                        location.pathname === "/myaccount"
                          ? "text-blue-500"
                          : ""
                      }`}
                    >
                      Mon compte
                    </NavLink>
                  </div>
                  <div className="ml-3">
                    <button
                      onClick={handleLogout}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Se déconnecter
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-base font-medium text-gray-800">
                    <NavLink
                      to="/login"
                      className={`text-gray-500 hover:text-gray-900 ${
                        location.pathname === "/login" ? "text-blue-500" : ""
                      }`}
                    >
                      Connexion
                    </NavLink>
                  </div>
                  <div className="ml-3">
                    <NavLink
                      to="/register"
                      className={`text-gray-500 hover:text-gray-900 ${
                        location.pathname === "/register" ? "text-blue-500" : ""
                      }`}
                    >
                      Inscription
                    </NavLink>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
