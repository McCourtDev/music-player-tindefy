import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "319f13bb4a2b48bfbb1271eadd29e2cb",
});

function TopTracks({ accessToken }) {
  const [topTracks, setTopTracks] = useState([]);
  const [isMinimized, setIsMinimized] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const fetchUserProfile = async () => {
    try {
      const response = await spotifyApi.getMe();
      setDisplayName(response.body.display_name);
      setProfileImage(response.body.images[0]?.url);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);

    fetchUserProfile();

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
    <div className=" mb-28">
      <div className="bg-gray-900 p-6 rounded-lg mt-12 shadow-custom">
        <div className="flex flex-col items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            {displayName ? `${displayName}'s Top Tracks` : "Your Top Tracks"}
            {profileImage && (
              <img
                src={profileImage}
                alt="User's profile"
                className="w-8 h-8 object-cover rounded-full ml-2"
              />
            )}
          </h2>
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg mt-4"
            onClick={toggleMinimize}
          >
            {isMinimized ? "Open" : "Close"}
          </button>
        </div>
        {!isMinimized && (
          <ul className="grid grid-cols-2 gap-4">
            {topTracks.map((track, index) => (
              <li
                className="bg-primary rounded-lg p-4 text-white flex"
                key={index}
              >
                <div className="flex-shrink-0">
                  <img
                    src={track.album.images[0]?.url}
                    alt={`Cover of ${track.name}`}
                    className="w-24 h-24 object-cover mb-2"
                  />
                </div>
                <div className="flex-grow flex flex-col ml-4 justify-center">
                  <span className="text-white font-bold">{track.name}</span>
                  <span className="text-gray-400">{track.artists[0].name}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TopTracks;
