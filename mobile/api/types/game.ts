interface Cover {
  id: number;
  url: string;
}

interface Genre {
  id: number;
  name: string;
}

export interface Game {
  id: number;
  name: string;
  cover: Cover;
  total_rating: number;
  releaseDate: string;
  genres: Genre[];
  first_release_date: number;
}
