export interface IVenue {
  id: string;
  name: string;
  capacity: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  sr_id: string;
  location: {
    lat: string;
    lng: string;
  };
}

export interface ITeam {
  name: string;
  alias: string;
  id: string;
  sr_id: string;
  reference: string;
}

export interface IBroadCast {
  network: string;
  type: string;
  locale: string;
  channel: string;
}

export interface IGame {
  home: ITeam;
  away: ITeam;
  scheduled: string;
  venue: IVenue;
}

export interface ILeague {
  id: string;
  name: string;
  alias: string;
}

// responses
export interface IGetGamesOfTheDayResponse {
  date: string;
  league: ILeague;
  games: IGame[];
}

export type TGetGamesOfTheDay = () => Promise<IGetGamesOfTheDayResponse>;
