import React, { useContext, useEffect } from "react";
import Logo from "./logo-1.png";
import { AuthContext } from "./AuthContext";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=319f13bb4a2b48bfbb1271eadd29e2cb&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-top-read";

export default function Login() {
  const { loggedIn, setLoggedIn } = useContext(AuthContext);

  const handleClick = () => {
    console.log("Login button clicked");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
  }, [setLoggedIn]);

  return (
    <div className="h-screen bg-slate-500 flex flex-col items-center justify-center">
      <img src={Logo} className="h-2/4 flex" alt="Tinderfy Logo" />
      <h1 className="text-white text-3xl text-center font-bold pl-5">
        Welcome to Tindefy
      </h1>
      <h2 className="mt-4 text-white text-lg text-center pl-5">
        Tired of listening to the same old music? <br />
        Discover new music based on your interests!
      </h2>
      <button
        onClick={() => (window.location.href = AUTH_URL)}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Log in with Spotify
      </button>
    </div>
  );
}
