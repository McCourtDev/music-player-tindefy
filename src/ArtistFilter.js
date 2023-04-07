import React, { useState } from "react";
import axios from "axios";

function ArtistFilter({
  accessToken,
  onArtistSelect,
  fetchTopTracks,
  setPlayingTrack,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [artistOptions, setArtistOptions] = useState([]);

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
    onArtistSelect(artistId);
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
  };
  // ...

  return (
    <div className="artist-filter">
      <input
        type="text"
        placeholder="Search for an artist"
        value={searchTerm}
        onChange={handleChange}
        className="border py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
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
