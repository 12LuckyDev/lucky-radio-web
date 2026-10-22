import { useSpotify } from "./contexts/spotify-context";
import clsx from "clsx";

import "./spotify-header.css";

function getDeviceTypeIcon(type: string | null): string {
  switch (type) {
    case "SPEAKER":
      return "fa-drum-steelpan";
    case "COMPUTER":
      return "fa-computer";
    case "TABLET":
      return "fa-tablet";
    case "SMARTPHONE":
      return "fa-mobile";
    case null:
      return "fa-circle-question";
    default:
      return "fa-headphones";
  }
}

export function SpotifyHeader() {
  const {
    device: { name, type, username },
  } = useSpotify();

  return (
    <>
      <nav class="level is-mobile">
        <div class="level-left device-info">
          <div class="level-item">
            <span class="icon is-large">
              <i class={clsx("fas", "fa-2x", getDeviceTypeIcon(type))}></i>
            </span>
          </div>
          <div class="level-item">{name ?? "librespot"}</div>
        </div>

        <div class="level-right">
          <div class="level-item">{username ?? "username"}</div>
          <div class="level-item">
            <span class="icon is-large">
              <i class="fas fa-2x fa-circle-user"></i>
            </span>
          </div>
        </div>
      </nav>
    </>
  );
}
