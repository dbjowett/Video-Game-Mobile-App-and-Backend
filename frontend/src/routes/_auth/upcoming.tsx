import { Box, Button, Flex, Group, Loader, Stack, Text, Title } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ListGame } from '@vg/types';
import dayjs from 'dayjs';
import { ReactNode, useMemo, useState } from 'react';

import { GameCard } from '../../components/GameCard/GameCard';
import { useGameReleases } from '../../hooks/useGameReleases';
import { mapListGameToCard } from '../../utils/gameCard';

export const Route = createFileRoute('/_auth/upcoming')({
  component: RouteComponent,
});

const todayDateString = dayjs().format('YYYY-MM-DD');

const sortByPopularity = (games: ListGame[]): ListGame[] =>
  games.toSorted((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));

function RouteComponent() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(todayDateString);
  const [visibleMonth, setVisibleMonth] = useState(todayDateString);

  const { data: monthGames } = useGameReleases({ month: visibleMonth.slice(0, 7) });
  const {
    data: dayGames,
    isPending,
    isError,
  } = useGameReleases({ start: selectedDate, end: selectedDate });

  const releaseDatesInMonth = useMemo(() => {
    const set = new Set<string>();
    for (const game of monthGames ?? []) {
      if (!game.first_release_date) continue;
      set.add(dayjs.unix(game.first_release_date).format('YYYY-MM-DD'));
    }
    return set;
  }, [monthGames]);

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
      <Group justify="center" py="md">
        <Loader size="sm" />
      </Group>
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
            getDayProps={(date) => ({
              selected: date === selectedDate,
              onClick: () => setSelectedDate(date),
            })}
            renderDay={(date) => {
              const hasRelease = releaseDatesInMonth.has(date);
              return (
                <Box pos="relative">
                  {dayjs(date).date()}
                  {hasRelease ? (
                    <Box
                      pos="absolute"
                      bottom={2}
                      left="50%"
                      w={4}
                      h={4}
                      style={{
                        transform: 'translateX(-50%)',
                        borderRadius: '50%',
                        backgroundColor: 'var(--mantine-primary-color-6)',
                      }}
                    />
                  ) : null}
                </Box>
              );
            }}
          />

          <Stack gap="md" style={{ flex: 1, minWidth: 320 }}>
            <Title order={4}>{dayjs(selectedDate).format('dddd, MMMM D')}</Title>
            {dayListContent}
          </Stack>
        </Flex>
      </Stack>
    </Box>
  );
}
