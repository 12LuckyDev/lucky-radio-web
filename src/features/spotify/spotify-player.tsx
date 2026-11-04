import { PlayerLayout } from "../global/player-layout/player-layout";
import { useSpotify } from "./contexts/spotify-context";
import { SpotifyHeader } from "./spotify-header";
import { SpotifyPlayerButtons } from "./spotify-player-buttons";

import "./spotify-player.css";
import { SpotifySlider } from "./spotify-slider";

export function SpotifyPlayer() {
  const {
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
                <p class="subtitle is-6">{song.album}</p>
              </>
            ) : (
              <h1 class="title is-3">No song</h1>
            )
          }
          playerControlsChildren={
            <>
              <SpotifyPlayerButtons />
              <SpotifySlider />
            </>
          }
        />
      </div>
    </div>
  );
}
