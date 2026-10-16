export interface PlayerStateDTO {
  state: "play" | "stop" | "pause";
}

export interface PlayerStateWithTypeDTO extends PlayerStateDTO {
  type: string;
}
