import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import Player from "./Player";
import SpotifyWebApi from "spotify-web-api-node";
import TrackSearchResult from "./TrackSearchResult";
import axios from "axios";

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

  useEffect(() => {
    // If both these conditions are met, the function uses the spotifyApi to search for tracks that match the search query
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    // This stops the code from setting the searchResults variable if the request is cancelled
    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [search, accessToken]);

  return (
    <div className="flex h-screen flex-col bg-slate-500 ">
      <input
        id="searchBox"
        className="flex justify-center self-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500   pl-10 p-2.5 w-1/4 mt-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center "
        type="text"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      ></input>
      <div className=" flex-grow-1 my-2 overflow-y-auto ">
        {searchResults.map((track) => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
        {searchResults.length === 0 && (
          <div className=" text-center whitespace-pre text-white">{lyrics}</div>
        )}
      </div>

      <div className="fixed bottom-0 w-full">
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </div>
  );
}
