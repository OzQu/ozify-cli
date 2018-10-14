"use strict";

// might throw errors
module.exports.playlistContainsTrack = async function(spotifyApi, trackUri, playlistId) {
    // Fetch total amount of tracks
    const totalTracksResponse = await spotifyApi.getPlaylistTracks(playlistId, {
        fields: 'total,limit'
    });
    let offset = totalTracksResponse.body.total - totalTracksResponse.body.limit;
    let total = totalTracksResponse.body.total;

    do { // At least one request is necessary
        const tracksResponse = await spotifyApi.getPlaylistTracks(playlistId, {
            offset: offset,
            fields: 'offset,items(track(uri))'
        });
        const trackUris = tracksResponse.body.items.map(item => item.track.uri)
        if (trackUris.includes(trackUri)) return true;
        if (offset === 0) break; // Break if all has been checked
        offset = tracksResponse.body.offset - tracksResponse.body.items.length;
        offset = offset < 0 ? 0 : offset; // Assure that we don't try to over fetch
    } while(offset < total);
    return false; // If nothing found...
}



