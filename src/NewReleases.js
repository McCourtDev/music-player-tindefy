import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "319f13bb4a2b48bfbb1271eadd29e2cb",
});

function NewReleases({ accessToken }) {
  const [newReleases, setNewReleases] = useState([]);
  const [isMinimized, setIsMinimized] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);

    const getNewReleases = async () => {
      try {
        const response = await spotifyApi.getNewReleases({
          limit: 20,
          offset: 0,
          country: "GB",
        });
        setNewReleases(response.body.albums.items);
      } catch (error) {
        console.log(error);
      }
    };
    getNewReleases();
  }, [accessToken]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="mb-28">
      <div className="bg-gray-900 p-6 rounded-lg mt-12 shadow-custom">
        <div className="flex flex-col items-center mb-4">
          <h2 className="text-xl font-bold text-white">Top 20: New Releases</h2>
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg mt-4"
            onClick={toggleMinimize}
          >
            {isMinimized ? "Open" : "Close"}
          </button>
        </div>
        {!isMinimized && (
          <ul className="grid grid-cols-2 gap-4">
            {newReleases.map((release, index) => (
              <li
                className="bg-primary rounded-lg  p-4 text-white flex hover:bg-gray-800 hover:shadow-custom"
                key={index}
              >
                <a
                  href={release.external_urls.spotify}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-full flex"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={release.images[0]?.url}
                      alt={`Cover of ${release.name}`}
                      className="w-24 h-24 object-cover mb-2"
                    />
                  </div>
                  <div className="flex-grow flex flex-col ml-4 justify-center">
                    <span className="text-white font-bold">{release.name}</span>
                    <span className="text-gray-400">
                      {release.artists[0].name}
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default NewReleases;
