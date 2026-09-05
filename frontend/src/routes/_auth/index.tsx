import { Container, SimpleGrid, Stack, Title } from '@mantine/core';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PopKey } from '@vg/types';

import { GameCard } from '../../components/GameCard/GameCard';
import { usePopularGames } from '../../hooks/usePopularGames';
import { useUpcomingGames } from '../../hooks/useUpcomingGames';
import { mapListGameToCard } from '../../utils/gameCard';

export const Route = createFileRoute('/_auth/')({
  component: RouteComponent,
});

const popTypeTitleMap: Partial<Record<PopKey, string>> = {
  visits: '🎯 Most Visited',
  playing: '🎮 Currently Playing',
};

const visibleCategoryKeys: PopKey[] = ['visits', 'playing'];

function RouteComponent() {
  const navigate = useNavigate();
  const { data: upcomingGames } = useUpcomingGames();
  const { data: popularGames } = usePopularGames();

  const [heroGame, ...restUpcoming] = upcomingGames ?? [];

  const goToGame = (id: number) => void navigate({ to: '/games/$id', params: { id: String(id) } });

  return (
    <Container size="xl" py="lg">
      <Stack gap="xl">
        {heroGame ? (
          <Stack gap="sm">
            <Title order={3}>🔥 Top Upcoming This Month</Title>
            <SimpleGrid cols={{ base: 2, sm: 4, md: 6 }} spacing="md">
              <GameCard
                game={mapListGameToCard(heroGame, {
                  meta: heroGame.platforms?.map((p) => p.name).join(', ') || 'Unknown Platform',
                })}
                variant="feature"
                onClick={() => goToGame(heroGame.id)}
              />
              {restUpcoming.map((game) => (
                <GameCard
                  key={game.id}
                  game={mapListGameToCard(game)}
                  variant="feature"
                  onClick={() => goToGame(game.id)}
                />
              ))}
            </SimpleGrid>
          </Stack>
        ) : null}

        {popularGames
          ? visibleCategoryKeys.map((key) =>
              popularGames[key]?.length ? (
                <Stack gap="sm" key={key}>
                  <Title order={3}>{popTypeTitleMap[key]}</Title>
                  <SimpleGrid cols={{ base: 2, sm: 4, md: 6 }} spacing="md">
                    {popularGames[key].map((game) => (
                      <GameCard
                        key={game.id}
                        game={mapListGameToCard(game, {
                          badge: `${Math.trunc(game.total_rating)}%`,
                        })}
                        variant="feature"
                        onClick={() => goToGame(game.id)}
                      />
                    ))}
                  </SimpleGrid>
                </Stack>
              ) : null,
            )
          : null}
      </Stack>
    </Container>
  );
}
