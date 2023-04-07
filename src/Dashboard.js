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
import { GiPauseButton } from "react-icons/gi";
import SpotifyPlayer from "react-spotify-web-playback";
import GenreFilter from "./GenreFilter";
import TopTracks from "./TopTracks";
import ArtistFilter from "./ArtistFilter";

// Clinet ID
const spotifyApi = new SpotifyWebApi({
  clientId: "319f13bb4a2b48bfbb1271eadd29e2cb",
});
// Variables
export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");

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
      "rap",
      "Boy Band",
      "Synthpop",
      "Vocal House",
      "Tech House",
      "Progressive Trance",
      "Old School Hip Hop",
      "Funk",
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

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const handleFaplayClick = () => {
    if (!playingTrack) {
      handleSkipClick();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (hasMounted) return;
    handleSkipClick(); // Set the initial track
    setHasMounted(true);
  }, [hasMounted, handleSkipClick]);

  const [selectedArtist, setSelectedArtist] = useState("");
  function handleSkipClick() {
    if (selectedArtist) {
      handleArtistFilter(selectedArtist);
      return;
    }

    // Generate a random search query
    const randomQuery = selectedGenre
      ? `genre:${selectedGenre}`
      : "genre:" + getRandomGenre();

    // Search for tracks with the randomQuery
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

  async function addSongToPlaylist(trackUri) {
    try {
      const response = await axios.post("http://localhost:3001/spotify/like", {
        accessToken: accessToken,
        trackUri: trackUri,
      });

      if (response.status === 200) {
        console.log("Song added to playlist");
      } else {
        console.error("Error adding song to playlist");
      }
    } catch (error) {
      console.error("Error calling the API", error);
    }
  }

  const handleLikeClick = async () => {
    try {
      if (!accessToken || !playingTrack || !playingTrack.uri) return;
      console.log("Track URI:", playingTrack.uri);
      await addSongToPlaylist(playingTrack.uri); // Call the addSongToPlaylist function here
      console.log("Added track to library!");
    } catch (error) {
      console.log("Error object:", error);
      if (error.xhr) {
        console.log("Error status:", error.xhr.status);
        console.log("Error response body:", error.xhr.responseText);
      } else {
        console.log("Unable to get more information about the error.");
      }
    }
  };

  const [selectedGenre, setSelectedGenre] = useState("");
  const handleGenreFilter = (genre) => {
    setSelectedGenre(genre);

    // Generate a search query based on the selected genre
    const query = genre ? `genre:${genre}` : "";

    // Search for tracks with the search query
    spotifyApi.searchTracks(query).then((res) => {
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

  const fetchTopTracks = async (artistId) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.tracks;
      } else {
        throw new Error("Failed to fetch top tracks for the artist");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [tracks, setTracks] = useState([]);

  const handleArtistFilter = async (artistId) => {
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
  return (
    <div className="flex h-screen flex-col bg-slate-500 justify-center items-center ">
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
            {playingTrack?.images?.length && (
              <img
                className="h-1/2 w-1/2 md:h-96 md:w-96 flex items-center justify-center mx-auto bg-white"
                src={playingTrack.images[0].url}
                alt={playingTrack.name}
                style={{ width: "25%", height: "25%" }}
              />
            )}
            <div className="font-bold text-xl mb-2 flex justify-center text-white p-2">
              {playingTrack ? playingTrack.title : "(Song Title)"}
            </div>
            <h2 className="text-base flex justify-center text-white ">
              {playingTrack ? playingTrack.artist : "(Artist)"}
            </h2>

            {/* Add margin-top to position buttons below title and artist */}
            <div
              className="absolute bottom-0 w-full text-center text-4xl -space-x-36 flex justify-center pb-4"
              style={{ marginTop: "4rem" }}
            >
              <button onClick={handleLikeClick}>
                <BsFillHandThumbsUpFill className="fill-primary hover:fill-green-500" />
              </button>

              <button onClick={handleFaplayClick}>
                {isPlaying ? (
                  <GiPauseButton className="fill-primary hover:opacity-60" />
                ) : (
                  <FaPlay className="fill-primary hover:opacity-60" />
                )}
              </button>
              <button onClick={handleSkipClick}>
                <BsFillHandThumbsDownFill className="fill-primary hover:fill-red-600" />
              </button>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="absolute top-0 right-0 m-4">
                <GenreFilter handleFilter={handleGenreFilter} />
              </div>
              <div className="absolute top-0 left-0 m-4">
                <ArtistFilter
                  accessToken={accessToken}
                  onArtistSelect={setSelectedArtist} // Pass setSelectedArtist function here
                  fetchTopTracks={fetchTopTracks}
                  setPlayingTrack={setPlayingTrack}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <TopTracks accessToken={accessToken} />
      </div>

      <div className="fixed bottom-0 w-full">
        <Player
          accessToken={accessToken}
          trackUri={playingTrack?.uri}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      </div>
    </div>
  );
}
