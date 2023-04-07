import React from "react";

export default function TrackSearchResult({ track, chooseTrack }) {
  function handlePlay() {
    chooseTrack(track);
  }
  return (
    <div className="flex flex-row ">
      <div
        className="track flex m-2 items-center cursor-pointer"
        onClick={handlePlay}
      >
        <img src={track.albumUrl} className="h-16 w-16" />
        <div className="">
          <div className=" pl-2 text-white">{track.title}</div>
          <div className=" pl-2 text-white">{track.artist}</div>
        </div>
      </div>
    </div>
  );
}
