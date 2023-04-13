import React, { useState } from "react";
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";

function ArtistFilter({
  accessToken,
  onArtistSelect,
  fetchTopTracks,
  setPlayingTrack,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [artistOptions, setArtistOptions] = useState([]);
  const [playSimilarArtists, setPlaySimilarArtists] = useState(false);
  const spotifyApi = new SpotifyWebApi({
    clientId: "319f13bb4a2b48bfbb1271eadd29e2cb",
  });
  spotifyApi.setAccessToken(accessToken);

  const togglePlaySimilarArtists = () => {
    setPlaySimilarArtists(!playSimilarArtists);
  };

  const searchArtists = async (searchTerm) => {
    if (!searchTerm) {
      setArtistOptions([]);
      return;
    }

    try {
      const response = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: searchTerm,
          type: "artist",
          limit: 10,
        },
      });

      setArtistOptions(response.data.artists.items);
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    searchArtists(e.target.value);
  };

  const handleSelect = async (artistId) => {
    const selectedArtist = artistOptions.find(
      (artist) => artist.id === artistId
    );

    setSearchTerm(selectedArtist.name);
    setArtistOptions([]);

    onArtistSelect(artistId);

    if (playSimilarArtists) {
      const response = await spotifyApi.getArtistRelatedArtists(artistId);
      const similarArtists = response.body.artists;
      const randomArtistIndex = Math.floor(
        Math.random() * similarArtists.length
      );
      const randomArtist = similarArtists[randomArtistIndex];
      artistId = randomArtist.id;
    }

    const topTracks = await fetchTopTracks(artistId);

    // Choose a random track from the artist's top tracks
    const randomTrack = topTracks[Math.floor(Math.random() * topTracks.length)];

    // Set the playing track to the chosen track
    setPlayingTrack({
      artist: randomTrack.artists[0].name,
      title: randomTrack.name,
      uri: randomTrack.uri,
      images: randomTrack.album.images,
    });

    // Reset the play mode after playing a song
    setPlaySimilarArtists(false);
  };

  const resetSelectedArtist = () => {
    setSearchTerm("");
    setArtistOptions([]);
    onArtistSelect(null);
    setPlayingTrack(null);
  };

  // ...

  return (
    <div className="artist-filter relative">
      <span
        className="inline-flex items-center rounded-full p-2 bg-primary text-white group transition-all duration-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        role="alert"
        tabIndex="0"
      >
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
            clipRule="evenodd"
          />
        </svg>
        <span className="whitespace-nowrap inline-block group-hover:max-w-screen-2xl group-focus:max-w-screen-2xl max-w-0 scale-80 group-hover:scale-100 overflow-hidden transition-all duration-500 group-hover:px-2 group-focus:px-2">
          <button
            onClick={togglePlaySimilarArtists}
            className={`text-sm font-medium focus:outline-none ${
              playSimilarArtists ? "text-white" : "text-gray-800"
            } hover:text-gray-900 transition-colors duration-300`}
          >
            {playSimilarArtists
              ? "Play Similar Artists"
              : "Play Searched Artist"}
          </button>
        </span>
      </span>

      <input
        type="text"
        placeholder="Search for an artist"
        value={searchTerm}
        onChange={handleChange}
        className="border py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 ml-4"
        style={{ paddingRight: "1.5rem" }}
      />

      {searchTerm && (
        <button
          onClick={resetSelectedArtist}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      )}

      {artistOptions.length > 0 && (
        <ul className="artist-options mt-2 space-y-2">
          {artistOptions.map((artist) => (
            <li
              key={artist.id}
              onClick={() => handleSelect(artist.id)}
              className="p-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300"
            >
              {artist.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ArtistFilter;
