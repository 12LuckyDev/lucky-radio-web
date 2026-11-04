import { useEffect, useState } from "preact/hooks";
import { Slider } from "../../components/slider/slider";
import { useSpotify } from "./contexts/spotify-context";

import "./spotify-slider.css";
import { api } from "./api/api";
import { useNotifications } from "../../contexts/notification/notification-context";
import { errorMsgHelper } from "../../core/error-msg-helper";

const step = 100;

function formatTime(milliseconds: number) {
  const totalSeconds = Math.floor(Math.max(0, milliseconds) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function SpotifySlider() {
  const notifications = useNotifications();

  const {
    current: { song },
    position: currentPosition,
  } = useSpotify();

  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setTime(0);
    setDuration(song?.duration ?? 0);

    if (!song) return;

    const interval = setInterval(() => {
      setTime((prev) => Math.min(prev + step, song.duration));
    }, step);

    return () => clearInterval(interval);
  }, [song?.id]);

  useEffect(() => {
    setTime(currentPosition);
  }, [currentPosition]);

  const onSeek = async (position: number) => {
    const prevPosition = time;
    try {
      setTime(position);
      await api.spotify.seek(position);
    } catch (error) {
      setTime(prevPosition);
      console.error("Failed to seek", error);
      notifications.danger(errorMsgHelper(error));
    }
  };

  return (
    <div class="spotify-slider-wrapper">
      <Slider currentTime={time} duration={duration} onSeek={onSeek} />
      <div className="times">
        <span>{formatTime(time)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
