import { Container, SimpleGrid, Stack, Title } from '@mantine/core';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { DEFAULT_PLATFORM_IDS, PopKey } from '@vg/types';

import { GameCardHoverPreview } from '../../components/GameCardHoverPreview/GameCardHoverPreview';
import { usePopularGames } from '../../hooks/usePopularGames';
import { useUpcomingGames } from '../../hooks/useUpcomingGames';
import { useUser } from '../../utils/auth';
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
  const { data: user } = useUser();
  const platformIds = user?.preferredPlatformIds.length
    ? user.preferredPlatformIds
    : DEFAULT_PLATFORM_IDS;
  const { data: upcomingGames } = useUpcomingGames(platformIds);
  const { data: popularGames } = usePopularGames(platformIds);

  const [heroGame, ...restUpcoming] = upcomingGames ?? [];

  const goToGame = (id: number) => void navigate({ to: '/games/$id', params: { id: String(id) } });

  return (
    <Container size="xl" py="lg">
      <Stack gap="xl">
        {heroGame ? (
          <Stack gap="sm">
            <Title order={3}>🔥 Top Upcoming This Month</Title>
            <SimpleGrid cols={{ base: 2, sm: 4, md: 6 }} spacing="md">
              <GameCardHoverPreview
                game={heroGame}
                cardModel={mapListGameToCard(heroGame, {
                  meta: heroGame.platforms?.map((p) => p.name).join(', ') || 'Unknown Platform',
                })}
                variant="feature"
                onClick={() => goToGame(heroGame.id)}
              />
              {restUpcoming.map((game) => (
                <GameCardHoverPreview
                  key={game.id}
                  game={game}
                  cardModel={mapListGameToCard(game)}
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
                      <GameCardHoverPreview
                        key={game.id}
                        game={game}
                        cardModel={mapListGameToCard(game, {
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
