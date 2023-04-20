import React, { useContext, useEffect, useState } from "react";
import Logo from "./logo-1.png";
import { AuthContext } from "./AuthContext";
import FAQ from "./FAQ";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=319f13bb4a2b48bfbb1271eadd29e2cb&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-top-read%20playlist-modify-public%20playlist-modify-private";

export default function Login() {
  const { setLoggedIn } = useContext(AuthContext);
  const [showFAQ, setShowFAQ] = useState(false);

  const handleClick = () => {
    setShowFAQ((prevShowFAQ) => !prevShowFAQ);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
  }, [setLoggedIn]);

  return (
    <div className="min-h-screen bg-slate-500 flex flex-col items-center justify-center space-y-6">
      <img src={Logo} className=" h-80 w-auto" alt="Tinderfy Logo" />
      <h1 className="text-white text-3xl text-center font-bold">
        Welcome to Tindefy
      </h1>
      <h2 className="text-white text-lg text-center">
        Tired of listening to the same old music? <br />
        Discover new music based on your interests!
      </h2>
      <button
        onClick={() => (window.location.href = AUTH_URL)}
        className="bg-primary hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded"
      >
        Log in with Spotify
      </button>
      <button
        onClick={handleClick}
        className="bg-primary hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded mt-4"
      >
        FAQ
      </button>
      {showFAQ && <FAQ />}
    </div>
  );
}
