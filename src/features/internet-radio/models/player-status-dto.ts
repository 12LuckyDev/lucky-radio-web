export type PlayerStatusDTO = {
  connected: boolean;
  lastConnectingAttempt: Date;
  status: {
    volume: number;
    state: "play" | "stop" | "pause";
  } | null;
  config: {
    host: string;
    port: number;
  };
};
