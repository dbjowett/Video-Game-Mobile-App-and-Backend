export interface User {
  id: string;
  name: string;
}

// Games
export interface PopularGame {
  id: number;
  game_id: number;
  popularity_type: number;
  value: number;
}

export interface Cover {
  id: number;
  url: string;
  width: number;
  height: number;
}
