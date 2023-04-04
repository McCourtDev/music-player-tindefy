import React, { useState, useEffect } from "react";
import Logo from "./logo-1.png";
import { FaPlay } from "react-icons/fa";
import { BsFillHandThumbsDownFill } from "react-icons/bs";
import { BsFillHandThumbsUpFill } from "react-icons/bs";
import SpotifyWebApi from "spotify-web-api-node";
import useAuth from "./useAuth";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: "319f13bb4a2b48bfbb1271eadd29e2cb",
});

export default function MusicMatch(code) {}
