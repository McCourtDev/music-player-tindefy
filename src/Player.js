import SpotifyPlayer from "react-spotify-web-playback";
import "./Player.css";

export default function Player({
  accessToken,
  trackUri,
  isPlaying,
  setIsPlaying,
}) {
  if (!accessToken) return null;
  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={(state) => {
        if (!state.isPlaying) setIsPlaying(false);
      }}
      play={isPlaying}
      uris={trackUri ? [trackUri] : []}
    />
  );
}
