export type CurrentSongDTO = {
  name: string;
  authors: string;
  album: string;
  imageUrl: string | null;
};

export type CurrentSongInfoDTO = { song: CurrentSongDTO | null };
