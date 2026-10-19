export type CurrentSongDTO = {
  name: string;
  authors: string;
  album: string;
};

export type CurrentSongInfoDTO = { song: CurrentSongDTO | null };
