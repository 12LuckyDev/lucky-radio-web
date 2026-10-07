export type PlayerStatusDTO = {
  type: string;
  connected: boolean;
  lastConnectingAttempt: Date;
  status: {
    state: "play" | "stop" | "pause";
  } | null;
};
