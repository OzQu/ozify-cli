"use strict";
if (process.argv.length < 7) {
    console.log("missing arguments");
    return;
}
const clientId = process.argv[2];
const clientSecret = process.argv[3];
const code = process.argv[4];
const refreshCode = process.argv[5];
const playlist = process.argv[6];
const playlistSplitted = playlist.split(":");
const playlistId = playlistSplitted[playlistSplitted.length - 1];

const notifier = require('node-notifier');
const SpotifyWebApi = require('spotify-web-api-node');
const credentials = {
    clientId: clientId,
    clientSecret: clientSecret,
    redirectUri: 'https://localhost:8080'
};

let spotifyApi = new SpotifyWebApi(credentials);
spotifyApi.setAccessToken(code);
spotifyApi.setRefreshToken(refreshCode);

(async () => {
    try {
        notifier.notify({
            title: "Ozify-cli",
            message: "Removing currently playing song from the Playlist",
        })
        const refreshTokenData = await spotifyApi.refreshAccessToken();
        spotifyApi.setAccessToken(refreshTokenData.body['access_token']);
    } catch (err) {
        console.log("Couldn't refresh: ", err);
    }

    try {
        const data = await spotifyApi.getMyCurrentPlayingTrack();
        if (!data.body.item) {
            throw "No tracks playing";
        }

        // I'd like to destruct data.body.item to both of following (name and artists).
        // I just don't know how to map and join array while descturcting
        const name = data.body.item.name
        const artists = data.body.item.artists.map(artist => artist.name).join(", ")

        const tracks = [data.body.item.uri];
        const removeTracks = tracks.map(track => {
            return {"uri": track};
        });
        const removeResponse = await spotifyApi.removeTracksFromPlaylist(playlistId, removeTracks);
        notifier.notify({
            title: `Removed ${artists} - ${name} from Starred`,
            message: "Removed track from the Playlist with statusCode: " + removeResponse.statusCode,
            sound: true
        });
    } catch(err) {
        console.log("Just couldn't: ", err);
    }

})();

