# Ozify-cli

- Create app in https://developer.spotify.com/dashboard/applications
- Acquire clientId and clientSecret
- Acquire token and refreshToken via oauth2 authorization flow
- Run `npm install`
- Currently I have just added following key bindings to my i3 config
```
bindsym $mod+Ctrl+n exec node ~/path/to/addCurrentTrackToPlaylist.js clientId clientSecret token refreshToken playlistId
bindsym $mod+Ctrl+m exec node ~/path/to/removeCurrentFromPlaylist.js clientId clientSecret token refreshToken playlistId
```
- Later I'll wrap this up to some kind of service, which can be started at boot and first time you'll use it, it will ask authorization via browser
