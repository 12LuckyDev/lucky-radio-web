export type PlayerStatusDTO = {
  type: string;
  connected: boolean;
  lastConnectingAttempt: Date;
  status: {
    volume: number;
    state: "play" | "stop" | "pause";
  } | null;
};
