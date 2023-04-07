import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "319f13bb4a2b48bfbb1271eadd29e2cb",
});

function TopTracks({ accessToken }) {
  const [topTracks, setTopTracks] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);

    const getTopTracks = async () => {
      try {
        const response = await spotifyApi.getMyTopTracks({ limit: 10 });
        setTopTracks(response.body.items);
      } catch (error) {
        console.log(error);
      }
    };
    getTopTracks();
  }, [accessToken]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="bg-primary p-6 rounded-lg mt-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Your Top Tracks:</h2>
        <button
          className="px-4 py-2 bg-white text-gray-800 rounded-lg ml-2"
          onClick={toggleMinimize}
        >
          {isMinimized ? "Open" : "Close"}
        </button>
      </div>
      {!isMinimized && (
        <ul className="grid grid-cols-2 gap-4">
          {topTracks.map((track, index) => (
            <li className="bg-white rounded-lg p-4 text-gray-800" key={index}>
              {track.name} - {track.artists[0].name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TopTracks;
