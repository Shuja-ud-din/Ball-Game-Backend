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
  id: string;
  status: string;
  coverage: string;
  scheduled: string;
  home_points: number;
  away_points: number;
  track_on_court: boolean;
  sr_id: string;
  reference: string;
  time_zones: {
    venue: string;
    home: string;
    away: string;
  };
  venue: IVenue;
  broadcasts: IBroadCast[];
  home: ITeam;
  away: ITeam;
}

export interface ILeague {
  id: string;
  name: string;
  alias: string;
}

export interface ISeason {
  id: string;
  name: string;
  type: string;
  year: number;
}

export interface IBoxScore {
  attendance: number;
  lead_changes: number;
  times_tied: number;
  bonus: boolean;
  points: number;
  id: string;
  market: string;
  name: string;
  remaining_timeouts: number;
  reference: string;
  sr_id: string;
  scoring: {
    quarter: {
      points: number;
      number: number;
      sequence: number;
    }[];
    overtime: {
      points: number;
      number: number;
      sequence: number;
    }[];
  };
  home: boolean;
}

export interface IOfficial {
  assignment: string;
  experience: string;
  first_name: string;
  full_name: string;
  id: string;
  last_name: string;
  number: number;
}

export interface IPlayer {
  first_name: string;
  full_name: string;
  id: string;
  jersey_number: number;
  last_name: string;
  name_suffix: string;
  position: string;
  primary_position: string;
  reference: string;
  sr_id: string;
}

export interface ICoach {
  first_name: string;
  full_name: string;
  id: string;
  last_name: string;
  position: string;
  reference: string;
}

// responses
export interface IGetGamesOfTheDayResponse {
  date: string;
  league: ILeague;
  games: IGame[];
}

export type TGetGamesOfTheDay = () => Promise<IGetGamesOfTheDayResponse>;
