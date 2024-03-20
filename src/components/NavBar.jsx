import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem("userInfo");
    if (userInfoFromStorage) {
      setUserInfo(JSON.parse(userInfoFromStorage));
    }
  }, []);

  // Handle logout logic (replace with your actual logic)
  const handleLogout = () => {
    setIsLoggedIn(false); // Simulate logout
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <header>
      <div className="max-w-2xl mx-auto">
        <nav className="border-gray-200">
          <div className="container mx-auto flex flex-wrap items-center justify-between">
            <NavLink to="/" className="flex">
              <svg
                className="h-10 mr-3"
                width="51"
                height="70"
                viewBox="0 0 51 70"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              ></svg>
              <span className="self-center text-lg font-semibold whitespace-nowrap">
                Beez2Be{" "}
              </span>
            </NavLink>
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="md:hidden ml-3 text-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg inline-flex items-center justify-center"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className={`w-6 h-6 ${isMobileMenuOpen ? "hidden" : ""}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* ... (icône de menu fermé) ... */}
              </svg>
              <svg
                className={`w-6 h-6 ${isMobileMenuOpen ? "" : "hidden"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* ... (icône de menu ouvert) ... */}
              </svg>
            </button>
            <div
              className={`md:block w-full md:w-auto ${
                isMobileMenuOpen ? "" : "hidden"
              }`}
              id="mobile-menu"
            >
              <ul className="flex-col md:flex-row flex md:space-x-8 mt-4 md:mt-0 md:text-sm md:font-medium">
                <li
                  className={`hover:text-blue-500 ${
                    location.pathname === "/" ? "text-blue-500" : ""
                  }`}
                >
                  <NavLink to="/">Accueil </NavLink>
                </li>
                <li
                  className={`hover:text-blue-500 ${
                    location.pathname === "/companyList" ? "text-blue-500" : ""
                  }`}
                >
                  <NavLink to="/companyList">Entreprises </NavLink>
                </li>
                <li
                  className={`hover:text-blue-500 ${
                    location.pathname === "/companyForm" ? "text-blue-500" : ""
                  }`}
                >
                  <NavLink to="/companyForm">AjoutEntreprise </NavLink>
                </li>
                <li
                  className={`hover:text-blue-500 ${
                    location.pathname === "/contact" ? "text-blue-500" : ""
                  }`}
                >
                  <NavLink to="/contact">Contact </NavLink>
                </li>

                {isLoggedIn ? (
                  <>
                    <li
                      className={`hover:text-blue-500 ${
                        location.pathname === "/myaccount"
                          ? "text-blue-500"
                          : ""
                      }`}
                    >
                      <NavLink to="/myaccount">Mon compte </NavLink>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Se déconnecter
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li
                      className={`hover:text-blue-500 ${
                        location.pathname === "/login" ? "text-blue-500" : ""
                      }`}
                    >
                      <NavLink to="/login">Connexion</NavLink>
                    </li>
                    <li
                      className={`hover:text-blue-500 ${
                        location.pathname === "/register" ? "text-blue-500" : ""
                      }`}
                    >
                      <NavLink to="/register">Inscription</NavLink>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
