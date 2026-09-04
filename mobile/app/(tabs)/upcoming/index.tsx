import { useQuery } from '@tanstack/react-query';
import { ListGame } from '@vg/types';
import { router } from 'expo-router';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, SectionList, StyleSheet, TouchableOpacity } from 'react-native';
import { CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import { Theme } from 'react-native-calendars/src/types';

import { api } from '@/api/utils/api';
import GameCard from '@/components/GameCard';
import { AppText, View } from '@/components/Themed';
import { radius } from '@/theme/constants/radius';
import { spacing } from '@/theme/constants/spacing';
import { useTheme } from '@/theme/theme-context';
import { mapListGameToCard } from '@/utils/gameCard';

const fetchReleasesByMonth = async (month: string) =>
  await api.get(`games/releases?month=${month}`).json<ListGame[]>();

const fetchReleasesByRange = async (start: string, end: string) =>
  await api.get(`games/releases?start=${start}&end=${end}`).json<ListGame[]>();

const toLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addDays = (dateStr: string, days: number): string => {
  const date = new Date(`${dateStr}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split('T')[0];
};

const groupByDate = (games: ListGame[] | undefined): Record<string, ListGame[]> => {
  const grouped: Record<string, ListGame[]> = {};
  if (!games) return grouped;

  games.forEach((game) => {
    if (!game.first_release_date) return;
    const dateStr = toLocalDateString(new Date(game.first_release_date * 1000));

    if (!grouped[dateStr]) grouped[dateStr] = [];
    grouped[dateStr].push(game);
  });

  return grouped;
};

const todayDateString = toLocalDateString(new Date());

const initialMonth = todayDateString.slice(0, 7);
const WINDOW_DAYS_BACK = 2;
const WINDOW_DAYS_FORWARD = 7;

const initialWindow = {
  start: addDays(todayDateString, -WINDOW_DAYS_BACK),
  end: addDays(todayDateString, WINDOW_DAYS_FORWARD),
};

const sortByPopularity = (games: ListGame[] | undefined): ListGame[] =>
  (games ?? []).slice().sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));

const ReleaseCard = ({ game }: { game: ListGame }) => (
  <GameCard
    game={mapListGameToCard(game, {
      meta: game.platforms?.map((p) => p.name).join(', ') || 'Unknown Platform',
    })}
    variant="compact"
    onPress={() => router.navigate(`/games/${game.id}`)}
    style={styles.card}
  />
);

const SKELETON_COUNT = 5;

const GameCardSkeleton = () => {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeletonCard,
        { backgroundColor: colors.card, borderColor: colors.border, opacity },
      ]}
    >
      <View style={[styles.skeletonImage, { backgroundColor: colors.border }]} />
      <View style={styles.skeletonLines}>
        <View
          style={[
            styles.skeletonLine,
            styles.skeletonLineTitle,
            { backgroundColor: colors.border },
          ]}
        />
        <View
          style={[
            styles.skeletonLine,
            styles.skeletonLineSubtitle,
            { backgroundColor: colors.border },
          ]}
        />
      </View>
    </Animated.View>
  );
};

const GameListSkeleton = () => (
  <View style={styles.list}>
    {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
      <GameCardSkeleton key={index} />
    ))}
  </View>
);

const UpcomingReleasesScreen = () => {
  const { colors } = useTheme();

  const [selectedDate, setSelectedDate] = useState<string>(todayDateString);
  const [visibleMonth, setVisibleMonth] = useState<string>(initialMonth);
  const [fetchWindow, setFetchWindow] = useState(initialWindow);

  const { data: monthGames } = useQuery({
    queryKey: ['game-releases', visibleMonth],
    queryFn: () => fetchReleasesByMonth(visibleMonth),
  });

  const {
    data: windowGames,
    isLoading,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['game-releases-window', fetchWindow.start, fetchWindow.end],
    queryFn: () => fetchReleasesByRange(fetchWindow.start, fetchWindow.end),
  });

  const gamesByDateForMonth = useMemo(() => groupByDate(monthGames), [monthGames]);
  const gamesByDateForWindow = useMemo(() => groupByDate(windowGames), [windowGames]);

  const marked = useMemo(() => {
    const acc: Record<string, object> = {};
    Object.keys(gamesByDateForMonth).forEach((dateStr) => {
      acc[dateStr] = { marked: true };
    });
    acc[selectedDate] = {
      ...acc[selectedDate],
      selected: true,
      selectedColor: colors.primary,
    };
    return acc;
  }, [colors.primary, gamesByDateForMonth, selectedDate]);

  const theme: Theme = {
    monthTextColor: colors.primary,
    backgroundColor: colors.background,
    todayBackgroundColor: colors.surface,
    selectedDayBackgroundColor: colors.primary,
    arrowColor: colors.primary,
    todayTextColor: colors.primary,
    dotColor: colors.primary,
    calendarBackground: colors.background,
  };

  const selectDate = useCallback((date: string) => {
    setSelectedDate(date);
    setFetchWindow((current) => {
      if (date >= current.start && date <= current.end) return current;
      return { start: addDays(date, -WINDOW_DAYS_BACK), end: addDays(date, WINDOW_DAYS_FORWARD) };
    });
  }, []);

  const goToToday = useCallback(() => {
    setSelectedDate(todayDateString);
    setVisibleMonth(initialMonth);
    setFetchWindow(initialWindow);
  }, []);

  const isLoadingData = isPending || isLoading;
  const dayGames = gamesByDateForWindow[selectedDate];
  const popularGames = useMemo(
    () => sortByPopularity(dayGames?.filter((g) => (g.popularity ?? 0) > 0)),
    [dayGames],
  );
  const releasingGames = useMemo(
    () => sortByPopularity(dayGames?.filter((g) => !(g.popularity ?? 0))),
    [dayGames],
  );
  const sections = useMemo(() => {
    const result: { title: string; data: ListGame[] }[] = [];
    if (popularGames.length) result.push({ title: '🔥 Popular', data: popularGames });
    if (releasingGames.length) result.push({ title: '🎮 Other Releases', data: releasingGames });
    return result;
  }, [popularGames, releasingGames]);

  const renderItem = useCallback(({ item }: { item: ListGame }) => <ReleaseCard game={item} />, []);

  return (
    <CalendarProvider
      date={selectedDate}
      onDateChanged={selectDate}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ExpandableCalendar
        initialPosition={ExpandableCalendar.positions.CLOSED}
        allowShadow
        closeOnDayPress={false}
        current={`${visibleMonth}-01`}
        markedDates={marked}
        theme={theme}
        firstDay={1}
        onDayPress={(day) => selectDate(day.dateString)}
        onMonthChange={(month) => setVisibleMonth(month.dateString.slice(0, 7))}
      />

      <View style={styles.actionRow}>
        <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
          <CalendarIcon size={16} color={colors.primary} />
          <AppText style={{ color: colors.primary }}>Today</AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.dayList}>
        {isError ? (
          <View style={styles.emptyState}>
            <AppText>Error loading games</AppText>
          </View>
        ) : isLoadingData ? (
          <GameListSkeleton />
        ) : popularGames.length + releasingGames.length === 0 ? (
          <View style={styles.emptyState}>
            <AppText>No games found releasing this day</AppText>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            renderSectionHeader={({ section }) => (
              <AppText style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
                {section.title}
              </AppText>
            )}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </CalendarProvider>
  );
};

export default UpcomingReleasesScreen;

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayList: {
    flex: 1,
    marginTop: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  card: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    paddingVertical: spacing.sm,
  },
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
  },
  skeletonImage: {
    width: 52,
    height: 52,
    borderRadius: radius.round,
  },
  skeletonLines: {
    flex: 1,
    gap: spacing.sm,
  },
  skeletonLine: {
    height: 12,
    borderRadius: radius.xs,
  },
  skeletonLineTitle: {
    width: '60%',
  },
  skeletonLineSubtitle: {
    width: '40%',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.xl,
  },
});
