export const POPULARITY_MULTI_QUERY = `
  query popularity_primitives "visits" {
    fields game_id, popularity_type;
    sort value desc;
    limit 10;
    where popularity_type = 1;
  };

  query popularity_primitives "wantToPlay" {
    fields game_id, popularity_type;
    sort value desc;
    limit 10;
    where popularity_type = 2;
  };

  query popularity_primitives "playing" {
    fields game_id, popularity_type;
    sort value desc;
    limit 10;
    where popularity_type = 3;
  };

  query popularity_primitives "played" {
    fields game_id, popularity_type;
    sort value desc;
    limit 10;
    where popularity_type = 4;
  };

  query popularity_primitives "peakPlayers24h" {
    fields game_id, popularity_type;
    sort value desc;
    limit 10;
    where popularity_type = 5;
  };

  query popularity_primitives "positiveReviews" {
    fields game_id, popularity_type;
    sort value desc;
    limit 10;
    where popularity_type = 6;
  };

  query popularity_primitives "negativeReviews" {
    fields game_id, popularity_type;
    sort value desc;
    limit 10;
    where popularity_type = 7;
  };

  query popularity_primitives "totalReviews" {
    fields game_id, popularity_type;
    sort value desc;
    limit 10;
    where popularity_type = 8;
  };
`;
