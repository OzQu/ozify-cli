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
    await spotifyApi.refreshAccessToken()
        .then(data => {
            spotifyApi.setAccessToken(data.body['access_token']);
        })
        .catch(err => {
            console.log("Couldn't refresh: ", err);
        });

    let playlistSplitted = playlist.split(":");
    let playlistId = playlistSplitted[playlistSplitted.length - 1];

    await spotifyApi.getMyCurrentPlayingTrack()
        .then(data => {
            if (data.body.item) {
                let tracks = [data.body.item.uri];
                return spotifyApi.addTracksToPlaylist(playlistId, tracks);
            } else {
                throw "No tracks playing";
            }
        })
        .then(data => {
            notifier.notify({
                title: "Spotify-cli - Added track to Starred",
                message: "Added track with statusCode: " + data.statusCode,
                sound: true
            });
        })
        .catch(err => {
            console.log("Just couldn't: ", err);
        });

})();

