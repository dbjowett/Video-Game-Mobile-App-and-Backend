// oxlint-disable no-unsafe-member-access -- oxlint can't resolve this cross-package const object's members; confirmed clean via tsc
import { IgdbPopularityType } from '@vg/types';

export const buildPopularityByIdsQuery = (gameIds: number[]) => `
  fields game_id, value;
  where game_id = (${gameIds.join(',')}) & popularity_type = ${IgdbPopularityType.Visits};
  sort value desc;
`;

export const POPULARITY_MULTI_QUERY = `
  query popularity_primitives "visits" {
    fields game_id, popularity_type;
    sort value desc;
    limit 12;
    where popularity_type = ${IgdbPopularityType.Visits};
  };

  query popularity_primitives "wantToPlay" {
    fields game_id, popularity_type;
    sort value desc;
    limit 12;
    where popularity_type = ${IgdbPopularityType.WantToPlay};
  };

  query popularity_primitives "playing" {
    fields game_id, popularity_type;
    sort value desc;
    limit 12;
    where popularity_type = ${IgdbPopularityType.Playing};
  };

  query popularity_primitives "played" {
    fields game_id, popularity_type;
    sort value desc;
    limit 12;
    where popularity_type = ${IgdbPopularityType.Played};
  };

  query popularity_primitives "peakPlayers24h" {
    fields game_id, popularity_type;
    sort value desc;
    limit 12;
    where popularity_type = ${IgdbPopularityType.PeakPlayers24h};
  };

  query popularity_primitives "positiveReviews" {
    fields game_id, popularity_type;
    sort value desc;
    limit 12;
    where popularity_type = ${IgdbPopularityType.PositiveReviews};
  };

  query popularity_primitives "negativeReviews" {
    fields game_id, popularity_type;
    sort value desc;
    limit 12;
    where popularity_type = ${IgdbPopularityType.NegativeReviews};
  };

  query popularity_primitives "totalReviews" {
    fields game_id, popularity_type;
    sort value desc;
    limit 12;
    where popularity_type = ${IgdbPopularityType.TotalReviews};
  };
`;
