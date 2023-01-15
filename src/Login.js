import React from "react";
import Logo from "./logo-1.png";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=319f13bb4a2b48bfbb1271eadd29e2cb&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

export default function Login() {
  const handleClick = () => {
    console.log("Login button clicked");
  };
  return (
    <div className="h-screen bg-slate-500 flex flex-col items-center justify-center">
      <img src={Logo} className="h-2/4 flex  " alt="Tinderfy Logo " />
      <h1 className=" text-white text-3xl text-center font-bold pl-5 ">
        Welcome to Tindefy
      </h1>
      <h2 className="mt-4 text-white text-lg text-center pl-5">
        Tired of listening to the same old music? <br />
        Discover new music based on your interests!
      </h2>
    </div>
  );
}
