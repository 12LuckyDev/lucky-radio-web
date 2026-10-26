import { useSpotify } from "./contexts/spotify-context";
import clsx from "clsx";

import "./spotify-header.css";
import { useUi } from "../../contexts/ui/ui-context";

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

function SmallInfo({
  name,
  username,
  icon,
}: {
  name: string;
  username: string;
  icon: string;
}) {
  return (
    <div class="device-info">
      <div class="icon-text">
        <span class="icon">
          <i class={clsx("fas", icon)}></i>
        </span>
        <span>{name}</span>
      </div>
      <div class="icon-text">
        <span class="icon">
          <i class="fas fa-circle-user"></i>
        </span>
        <span>{username}</span>
      </div>
    </div>
  );
}

function BigInfo({
  name,
  username,
  icon,
}: {
  name: string;
  username: string;
  icon: string;
}) {
  return (
    <nav class="level is-mobile">
      <div class="level-left device-info">
        <div class="level-item">
          <span class="icon is-large">
            <i class={clsx("fas", "fa-2x", icon)}></i>
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
  );
}

export function SpotifyHeader() {
  const { isSmallerThan } = useUi();
  const isMobile = isSmallerThan("md");

  const {
    device: { name, type, username },
  } = useSpotify();

  const deviceIcon = getDeviceTypeIcon(type);

  const deviceName = name ?? "No device connected";
  const deviceUser = username ?? "No user connected to device";

  const info = isMobile ? (
    <SmallInfo name={deviceName} username={deviceUser} icon={deviceIcon} />
  ) : (
    <BigInfo name={deviceName} username={deviceUser} icon={deviceIcon} />
  );

  return <div class="header">{info}</div>;
}
