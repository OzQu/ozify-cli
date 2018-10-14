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

const util = require('./util');
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
        const data = await spotifyApi.refreshAccessToken();
        spotifyApi.setAccessToken(data.body['access_token']);
    } catch (err) {
        console.log("Couldn't refresh: ", err);
    }

    try {
        const data = await spotifyApi.getMyCurrentPlayingTrack();
        if (!data.body.item) {
            throw "No tracks playing";
        }
        const trackUri = data.body.item.uri;

        // I'd like to destruct data.body.item to both of following (name and artists).
        // I just don't know how to map and join array while descturcting
        const name = data.body.item.name
        const artists = data.body.item.artists.map(artist => artist.name).join(", ")

        // Check if already on list
        const trackAlreadyOnPlaylist = await util.playlistContainsTrack(spotifyApi, trackUri, playlistId)
        if (trackAlreadyOnPlaylist) {
            notifier.notify({
                title: `${artists} - ${name}`,
                message: "Track already on the Playlist",
                sound: true
            })
        } else {

            const tracks = [data.body.item.uri];
            const addResponse = await spotifyApi.addTracksToPlaylist(playlistId, tracks);
            notifier.notify({
                title: `${artists} - ${name}`,
                message: "Added track to the Playlist with statusCode: " + addResponse.statusCode,
                sound: true
            });
        }
    } catch (err) {
        console.log("Just couldn't: ", err);
    }

})();

