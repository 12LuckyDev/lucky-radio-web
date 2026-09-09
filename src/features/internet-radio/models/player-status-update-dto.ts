export type PlayerStatusUpdateDTO = {
  connected: boolean;
  volume: number;
  state: "play" | "stop" | "pause";
};
