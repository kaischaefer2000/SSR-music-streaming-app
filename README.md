## Spotify remote webplayer (SSR)
This application is deeply connected to the [Spotify Web API](https://developer.spotify.com/documentation/web-api/ "Spotify Web API"). Its styling is similar to the [original spotify web-player](https://open.spotify.com/ "original spotify web-player"). The application can be seen as some kind of remote control for an active spotify service. You can play songs from different playlists, controle the volume, skip songs or look at your favourite artists. 

------------

> **In order to use the clone, you have to have an actual spotify account!
The actual spotify application has to be active on any device, in which you are logged in with the same account!**

------------


## How to use it
1. Go to https://developer.spotify.com/ and create a new Project. There you can find your Client Id and Client Secret.
2. Go to 'Edit Settings' and paste the following as the 'Redirect URI' `http://localhost:3000/api/auth/callback/spotify`
3. Clone the repository
4. Run `npm install` or `yarn install`
5. Create a `.env` file in the root directory
6. Paste the following code into the file: NEXTAUTH_URL=http://localhost:3000
`NEXT_PUBLIC_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_CLIENT_ID=your_client_id
JWT_SECRET=a_random_string_you_can_choose`
7. Replace `your_client_secret` with the Client Secret from the Spotify Developer Account and do so with the `your_client_id`
8. Run `npm run dev`
9. Open your browser on `localhost:3000`
10. Open a new tab and go to the actual spotify player `https://open.spotify.com/` and play a song
11. Go to your localhost tab and log in with spotify


------------

## Rendering
This application was programmed as part of my bachelor thesis in which i compare the performance of rendering strategies. I coded it with Client Side Rendering, Server Side Rendering and a combination of both. This version uses Server Side Rendering.
