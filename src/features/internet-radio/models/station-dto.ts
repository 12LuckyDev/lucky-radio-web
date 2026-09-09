export type StationDTO = {
  id: string;
  name: string;
  url: string;
};

export type CreateStationDTO = Omit<StationDTO, "id">;

export type UpdateStationDTO = Partial<CreateStationDTO>;
