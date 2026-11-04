export type CurrentSongDTO = {
  id: string;
  name: string;
  authors: string;
  album: string;
  imageUrl: string | null;
  duration: number;
};

export type CurrentSongInfoDTO = { song: CurrentSongDTO | null };
