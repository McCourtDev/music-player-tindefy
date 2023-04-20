import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import Player from "./Player";
import SpotifyWebApi from "spotify-web-api-node";
import Logo from "./logo-1.png";
import { FaPlay } from "react-icons/fa";
import { BsFillHandThumbsDownFill } from "react-icons/bs";
import { BsFillHandThumbsUpFill } from "react-icons/bs";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { BsCheckCircle } from "react-icons/bs";
import { GiPauseButton } from "react-icons/gi";
import GenreFilter from "./GenreFilter";
import TopTracks from "./TopTracks";
import ArtistFilter from "./ArtistFilter";
import TopArtists from "./TopArtists";
import NewReleases from "./NewReleases";

// Clinet ID
const spotifyApi = new SpotifyWebApi({
  clientId: "319f13bb4a2b48bfbb1271eadd29e2cb",
});
// Variables
export default function Dashboard({ code, loggedIn, setLoggedIn }) {
  const accessToken = useAuth(code);
  const [playedTracks, setPlayedTracks] = useState(new Set());
  const [playingTrack, setPlayingTrack] = useState();

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
      "R&b",
      "Britpop",
      "Deep Ambient",
      "Deep Funk House",
      "Deep Melodic House",
      "Deep Pop Emo",
      "Deep Progressive Trance",
      "Deep Tech House",
      "Garage Pop",
      "Pop Emo",
    ];
    const randomIndex = Math.floor(Math.random() * genres.length);
    return genres[randomIndex];
  }

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    if (!loggedIn) {
      setLoggedIn(true); // Set loggedIn state to true when access token is set
    }
  }, [accessToken, loggedIn, setLoggedIn]);

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

      // Filter out tracks that have already been played
      const unplayedTracks = tracks.filter(
        (track) => !playedTracks.has(track.uri)
      );

      // If there are no unplayed tracks, clear the playedTracks set and use all tracks
      const availableTracks =
        unplayedTracks.length > 0 ? unplayedTracks : tracks;

      // Choose a random track from the available tracks
      const randomTrack =
        availableTracks[Math.floor(Math.random() * availableTracks.length)];

      // Set the playing track to the chosen track
      setPlayingTrack({
        artist: randomTrack.artists[0].name,
        title: randomTrack.name,
        uri: randomTrack.uri,
        images: randomTrack.album.images,
      });

      // Add the chosen track to the playedTracks set
      setPlayedTracks((prevPlayedTracks) => {
        const updatedPlayedTracks = new Set(prevPlayedTracks);
        updatedPlayedTracks.add(randomTrack.uri);
        return updatedPlayedTracks;
      });

      // If we had to use all tracks, clear the playedTracks set after adding the current track
      if (unplayedTracks.length === 0) {
        setPlayedTracks(new Set([randomTrack.uri]));
      }
    });
  }

  const [setCreatedPlaylistId] = useState(null);

  const handleLikeClick = () => {
    if (playingTrack) {
      addToMySavedTracks(playingTrack.uri.split(":")[2]);
      handleSkipClick(); // Skip to the next song
      setShowNotification(true);
      setShowSuccessIcon(true);
      setTimeout(() => {
        setShowNotification(false);
        setShowSuccessIcon(false);
      }, 3000);
    } else {
      console.log("No track is currently playing.");
    }
  };

  const [showNotification, setShowNotification] = useState(false);
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);

  const Notification = () => (
    <div
      className={`fixed p-2 border rounded-md font-bold text-white bg-primary ${
        showNotification ? "visible" : "invisible"
      }`}
      style={{
        top: "1rem",
        right: "1rem",
      }}
    >
      <span>Track added to library</span>
      {showSuccessIcon && (
        <span className="text-green-500 ml-2">
          <BsCheckCircle />
        </span>
      )}
    </div>
  );

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

  const handleCreatePlaylistClick = () => {
    // Create a private playlist called "Tindefy"
    spotifyApi
      .createPlaylist("Tindefy", {
        description: "Playlist generated from Tindefy",
        public: true,
      })
      .then(
        (data) => {
          console.log("Created playlist!");
          // Set the createdPlaylistId state with the new playlist's ID
          setCreatedPlaylistId(data.id);
        },
        (err) => {
          console.log("Something went wrong!", err);
        }
      );
  };

  function addToMySavedTracks(trackId) {
    spotifyApi.addToMySavedTracks([trackId]).then(
      function (data) {
        console.log("Added track!");
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-500 justify-center items-center pt-20">
      <div className="w-full flex flex-col items-center">
        <div
          id="Card"
          className="w-1/2 bg-gray-900 rounded-lg shadow-custom mb-8"
        >
          <img className="h-24 w-auto mx-auto " src={Logo} alt="" />

          <div className="px-6 py-4">
            {playingTrack?.images?.length && (
              <img
                className="h-1/2 w-1/2 md:h-96 md:w-96 mx-auto bg-white shadow-custom"
                src={playingTrack.images[0].url}
                alt={playingTrack.name}
              />
            )}
            <div className="font-bold text-xl mb-2 text-center text-white p-2">
              {playingTrack ? playingTrack.title : "(Song Title)"}
            </div>
            <h2 className="text-base text-center text-white">
              {playingTrack ? playingTrack.artist : "(Artist)"}
            </h2>

            <div className="text-center text-4xl space-x-12 flex justify-center pb-4 mt-8">
              <button onClick={handleSkipClick}>
                <BsFillHandThumbsDownFill className="fill-primary hover:fill-red-600" />
              </button>

              <button onClick={handleFaplayClick}>
                {isPlaying ? (
                  <GiPauseButton className="fill-primary hover:opacity-60" />
                ) : (
                  <FaPlay className="fill-primary hover:opacity-60" />
                )}
              </button>
              <button onClick={handleLikeClick}>
                <BsFillHandThumbsUpFill className="fill-primary hover:fill-green-500" />
              </button>

              <button onClick={handleCreatePlaylistClick}>
                <BsFillPlusCircleFill className="fill-primary hover:fill-blue-500" />
              </button>
            </div>
            <div className="flex justify-between mt-4">
              <div>
                <ArtistFilter
                  accessToken={accessToken}
                  onArtistSelect={setSelectedArtist}
                  fetchTopTracks={fetchTopTracks}
                  setPlayingTrack={setPlayingTrack}
                />
              </div>
              <div>
                <GenreFilter handleFilter={handleGenreFilter} />
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2">
          <TopTracks accessToken={accessToken} />
        </div>
        <div className="w-1/2">
          <TopArtists accessToken={accessToken} />
        </div>
        <div className="w-1/2">
          <NewReleases accessToken={accessToken} />
        </div>
      </div>
      <div className="fixed bottom-0 w-full">
        <Player
          accessToken={accessToken}
          trackUri={playingTrack?.uri}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      </div>
      <Notification />
    </div>
  );
}
