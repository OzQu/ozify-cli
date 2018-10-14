# Ozify-cli

## What
- Adds and removes currently playing track to pre defined playlist with the help of [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node)
- Wont add duplicates
- Removes all occurrences of the same track
- Uses [node-notifier](https://github.com/mikaelbr/node-notifier) for cross platform notifies
## Why
I'm used to listen my discover weekly playlist and add great songs to my 'Starred' playlist. I've always wanted to do this easily with hotkey.
## How
- Create app in https://developer.spotify.com/dashboard/applications
- Acquire clientId and clientSecret
- Acquire token and refreshToken via oauth2 authorization flow
- Run `npm install`
- Currently I have just added following key bindings to my i3 config
```
bindsym $mod+Ctrl+n exec node ~/path/to/addCurrentTrackToPlaylist.js clientId clientSecret token refreshToken playlistId
bindsym $mod+Ctrl+m exec node ~/path/to/removeCurrentFromPlaylist.js clientId clientSecret token refreshToken playlistId
```
## Still to do
- Later I'll wrap this up to some kind of service, which can be started at boot and first time you'll use it, it will ask authorization via browser
- [Project](https://github.com/OzQu/ozify-cli/projects/1)
