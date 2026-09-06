import { Box, Button, Flex, Group, ScrollArea, Stack, Text, Title } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { DEFAULT_PLATFORM_IDS, ListGame } from '@vg/types';
import dayjs from 'dayjs';
import { ReactNode, useMemo, useState } from 'react';

import { GameCard } from '../../components/GameCard/GameCard';
import { GameCardSkeleton } from '../../components/GameCard/GameCardSkeleton';
import { useGameReleases } from '../../hooks/useGameReleases';
import { useUser } from '../../utils/auth';
import { mapListGameToCard } from '../../utils/gameCard';

const SKELETON_COUNT = 4;

export const Route = createFileRoute('/_auth/upcoming')({
  component: RouteComponent,
});

const todayDateString = dayjs().format('YYYY-MM-DD');

const sortByPopularity = (games: ListGame[]): ListGame[] =>
  games.toSorted((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));

const HEAT_COLORS = [
  'var(--mantine-color-blue-1)',
  'var(--mantine-color-blue-3)',
  'var(--mantine-color-blue-5)',
];

const getHeatColor = (count: number, maxCount: number): string | undefined => {
  if (count === 0 || maxCount === 0) return undefined;
  const ratio = count / maxCount;
  if (ratio > 0.66) return HEAT_COLORS[2];
  if (ratio > 0.33) return HEAT_COLORS[1];
  return HEAT_COLORS[0];
};

function RouteComponent() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const platformIds = user?.preferredPlatformIds.length
    ? user.preferredPlatformIds
    : DEFAULT_PLATFORM_IDS;
  const [selectedDate, setSelectedDate] = useState(todayDateString);
  const [visibleMonth, setVisibleMonth] = useState(todayDateString);

  const { data: monthGames } = useGameReleases({
    month: visibleMonth.slice(0, 7),
    platformIds,
  });
  const {
    data: dayGames,
    isPending,
    isError,
  } = useGameReleases({
    start: selectedDate,
    end: selectedDate,
    platformIds,
  });

  const releaseCountsInMonth = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const game of monthGames ?? []) {
      if (!game.first_release_date) continue;
      const date = dayjs.unix(game.first_release_date).format('YYYY-MM-DD');
      counts[date] = (counts[date] ?? 0) + 1;
    }
    return counts;
  }, [monthGames]);

  const maxReleaseCountInMonth = Math.max(0, ...Object.values(releaseCountsInMonth));

  const popularGames = useMemo(
    () => sortByPopularity((dayGames ?? []).filter((g) => (g.popularity ?? 0) > 0)),
    [dayGames],
  );
  const otherGames = useMemo(
    () => sortByPopularity((dayGames ?? []).filter((g) => !(g.popularity ?? 0))),
    [dayGames],
  );

  const goToToday = () => {
    setSelectedDate(todayDateString);
    setVisibleMonth(todayDateString);
  };

  const goToGame = (id: number) => void navigate({ to: '/games/$id', params: { id: String(id) } });

  const renderReleaseGroup = (title: string, games: ListGame[]) =>
    games.length > 0 ? (
      <Stack gap="xs">
        <Title order={5}>{title}</Title>
        <Stack gap="xs">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={mapListGameToCard(game, {
                meta: game.platforms?.map((p) => p.name).join(', '),
              })}
              variant="compact"
              onClick={() => goToGame(game.id)}
            />
          ))}
        </Stack>
      </Stack>
    ) : null;

  let dayListContent: ReactNode;
  if (isError) {
    dayListContent = <Text c="dimmed">Error loading games</Text>;
  } else if (isPending) {
    dayListContent = (
      <Stack gap="xs">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <GameCardSkeleton key={index} variant="compact" />
        ))}
      </Stack>
    );
  } else if (popularGames.length + otherGames.length === 0) {
    dayListContent = <Text c="dimmed">No games found releasing this day</Text>;
  } else {
    dayListContent = (
      <>
        {renderReleaseGroup('🔥 Popular', popularGames)}
        {renderReleaseGroup('🎮 Other Releases', otherGames)}
      </>
    );
  }

  return (
    <Box py="lg" px="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={3}>Upcoming Releases</Title>
          <Button
            leftSection={<IconCalendar size={16} />}
            variant="light"
            size="xs"
            onClick={goToToday}
          >
            Today
          </Button>
        </Group>

        <Flex gap="xl" align="flex-start" wrap="wrap">
          <Calendar
            size="lg"
            date={visibleMonth}
            onDateChange={setVisibleMonth}
            firstDayOfWeek={1}
            getDayProps={(date) => {
              const isSelected = date === selectedDate;
              return {
                selected: isSelected,
                onClick: () => setSelectedDate(date),
                style: isSelected
                  ? undefined
                  : {
                      backgroundColor: getHeatColor(
                        releaseCountsInMonth[date] ?? 0,
                        maxReleaseCountInMonth,
                      ),
                    },
              };
            }}
          />

          <Stack gap="md" style={{ flex: 1, minWidth: 320 }}>
            <Title order={4}>{dayjs(selectedDate).format('dddd, MMMM D')}</Title>
            <ScrollArea.Autosize mah="calc(100vh - 220px)" type="auto" offsetScrollbars>
              {dayListContent}
            </ScrollArea.Autosize>
          </Stack>
        </Flex>
      </Stack>
    </Box>
  );
}
