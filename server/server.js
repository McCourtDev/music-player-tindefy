require("dotenv").config();
const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const cors = require("cors");
const bodyParser = require("body-parser");
const lyricsFinder = require("lyrics-finder");
const PORT = process.env.PORT || 3002;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  console.log(refreshToken);
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.access_token, // Updated
        expiresIn: data.body.expires_in, // Updated
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      res.sendStatus(400);
    });
});

app.post("/spotify/createPlaylist", (req, res) => {
  // Your logic for creating a playlist goes here
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.get("/lyrics", async (req, res) => {
  const lyrics =
    (await lyricsFinder(req.query.artist, req.query.track)) ||
    "No Lyrics Found";
  res.json({ lyrics });
});

// POST endpoint for adding a track to the user's library
app.post("/spotify/like", async (req, res) => {
  const { accessToken, trackUri } = req.body;
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    await spotifyApi.addToMySavedTracks([trackUri]);
    res.status(200).send("Track added to your library!");
  } catch (err) {
    console.error(err);
    res.status(400).send("Error adding track to your library");
  }
});

app.post("/spotify/createPlaylist", async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ error: "Access token is required" });
  }

  const spotifyApi = new SpotifyWebApi({
    accessToken,
  });

  try {
    const userData = await spotifyApi.getMe();
    const userId = userData.body.id;

    const playlist = await spotifyApi.createPlaylist(userId, "My Playlist", {
      public: true,
    });

    res.status(200).json({
      playlistId: playlist.body.id,
    });
  } catch (error) {
    console.error("Error creating playlist", error);
    res.status(500).json({ error: "Failed to create playlist" });
  }
});

console.log("Redirect URI:", process.env.REDIRECT_URI);
console.log("Client ID:", process.env.CLIENT_ID);
console.log("Client Secret:", process.env.CLIENT_SECRET);

app.listen(3001);
