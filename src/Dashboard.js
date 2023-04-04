import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import Player from "./Player";
import SpotifyWebApi from "spotify-web-api-node";
import TrackSearchResult from "./TrackSearchResult";
import axios from "axios";
import Logo from "./logo-1.png";
import { FaPlay } from "react-icons/fa";
import { BsFillHandThumbsDownFill } from "react-icons/bs";
import { BsFillHandThumbsUpFill } from "react-icons/bs";
import SpotifyPlayer from "react-spotify-web-playback";

// Clinet ID
const spotifyApi = new SpotifyWebApi({
  clientId: "319f13bb4a2b48bfbb1271eadd29e2cb",
});
// Variables
export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");

  // This function clears the searchbar, search results and lyrics when entering new song in search
  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  }

  function getRandomGenre() {
    const genres = [
      "rock",
      "pop",
      "hip hop",
      "country",
      "jazz",
      "dance",
      "deep house",
    ];
    const randomIndex = Math.floor(Math.random() * genres.length);
    return genres[randomIndex];
  }

  // This hook makes a HTTP GET request to the /lyrics endpoint
  useEffect(() => {
    // Only runs when the playingTrack state variable changes
    if (!playingTrack) return;

    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then((res) => {
        setLyrics(res.data.lyrics);
      });
  }, [playingTrack]);

  // This hook only runs when the accessToken state variable changes to ensure that the accessToken is only updated when it changes.

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  // Function to handle the "Faplay" button click
  const handleFaplayClick = () => {
    // Generate a random search query
    const randomQuery = "genre:" + getRandomGenre();

    // Search for tracks with the random query
    spotifyApi.searchTracks(randomQuery).then((res) => {
      const tracks = res.body.tracks.items;

      // Choose a random track from the search results
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];

      // Set the playing track to the chosen track
      setPlayingTrack({
        artist: randomTrack.artists[0].name,
        title: randomTrack.name,
        uri: randomTrack.uri,
        images: randomTrack.album.images,
      });
    });
  };

  function handleSkipClick() {
    // Generate a random search query
    const randomQuery = "genre:" + getRandomGenre();

    // Search for tracks with the random query
    spotifyApi.searchTracks(randomQuery).then((res) => {
      const tracks = res.body.tracks.items;

      // Choose a random track from the search results
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];

      // Set the playing track to the chosen track
      setPlayingTrack({
        artist: randomTrack.artists[0].name,
        title: randomTrack.name,
        uri: randomTrack.uri,
        images: randomTrack.album.images,
      });
    });
  }

  async function handleLikeClick() {
    if (!playingTrack) return;

    try {
      await spotifyApi.addToMySavedTracks([playingTrack.uri]);
      console.log(
        `Added ${playingTrack.title} by ${playingTrack.artist} to Liked Songs`
      );
    } catch (e) {
      console.error("Error adding track to Liked Songs:", e);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-slate-500 justify-center items-center">
      <div
        id="Card"
        className="h-1/2 w-1/2 flex justify-center bg-gray-900 relative rounded-lg shadow-custom "
      >
        <div className="rounded overflow-hidden shadow-lg w-full">
          <img
            className="h-24 flex items-center justify-center mx-auto"
            src={Logo}
            alt="Sunset in the mountains"
          />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2 flex justify-center text-white p-4">
              {playingTrack ? playingTrack.title : "(Song Title)"}
            </div>
            <h2 className="text-base flex justify-center text-white p-4">
              {playingTrack ? playingTrack.artist : "(Artist)"}
            </h2>
            {playingTrack?.images?.length && (
              <img
                className="h-80 w-80 flex items-center justify-center mx-auto bg-white"
                src={playingTrack.images[0].url}
                alt={playingTrack.name}
              />
            )}
            <div className="absolute bottom-0 w-full text-center text-4xl -space-x-36">
              <button onClick={handleSkipClick}>
                <BsFillHandThumbsDownFill className="fill-primary hover:fill-red-600" />
              </button>
              <button onClick={handleFaplayClick}>
                <FaPlay className="fill-primary hover:opacity-60" />
              </button>
              <button onClick={handleLikeClick}>
                <BsFillHandThumbsUpFill className="fill-primary hover:fill-green-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full">
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </div>
  );
}
