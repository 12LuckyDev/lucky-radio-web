import { PlayerLayout } from "../global/player-layout/player-layout";
import { useSpotify } from "./contexts/spotify-context";
import { SpotifyHeader } from "./spotify-header";

import "./spotify-player.css";

export function SpotifyPlayer() {
  const {
    isPlaying,
    current: { song },
  } = useSpotify();

  return (
    <div class="spotify">
      <SpotifyHeader />
      <div class="player-wrapper">
        <PlayerLayout
          useFallbackImage
          imageUrl={song?.imageUrl}
          currentInfoChildren={
            song !== null ? (
              <>
                <p class="title is-3">{song.name}</p>
                <p class="subtitle is-4">{song.authors}</p>
                {song.album}
              </>
            ) : (
              <h1 class="title is-3">No song</h1>
            )
          }
          playerControlsChildren={isPlaying ? "PAUSE" : "PLAY"}
        />
      </div>
    </div>
  );
}
