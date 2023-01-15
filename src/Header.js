import { useState, useEffect } from "react";
import Logo from "./logo-1.png";
import useAuth from "./useAuth";

// Requests authorisation to access the Spotify API
const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=319f13bb4a2b48bfbb1271eadd29e2cb&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";
export default function Header() {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresIn, setExpiresIn] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    let accessToken = window.localStorage.getItem("token");

    if (!accessToken && hash) {
      accessToken = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      console.log(accessToken);

      window.location.hash = "";
      window.localStorage.setItem("token", accessToken);
    }
    setAccessToken(accessToken);
  }, []);

  const logout = () => {
    setAccessToken("");
    window.localStorage.removeItem("token");
  };

  return (
    <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <a href="/dashboard" className="flex items-center">
          <img
            src={Logo}
            className="h-6 mr-3 sm:h-9 animate-pulse-slow"
            alt="Tinderfy Logo"
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Tindefy
          </span>
        </a>

        <div className="flex md:order-2">
          {!accessToken ? (
            <button
              type="button"
              className="text-white bg-primary hover:bg-cyan-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-primary dark:hover:bg-cyan-500"
            >
              <a href={AUTH_URL}>Login</a>
            </button>
          ) : (
            <button
              onClick={logout}
              className="text-white bg-primary hover:bg-cyan-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-primary dark:hover:bg-cyan-500 "
            >
              Logout
            </button>
          )}
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-cta"
        >
          <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-white md:p-0 dark:text-white md:dark:hover:text-primary"
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#searchBox"
                className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-primary dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                SongFinder
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
