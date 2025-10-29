import { ListGame } from '@/api/types/game';
import { api } from '@/api/utils/api';
import { useTheme } from '@/theme/theme-context';
import { imageLoader } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Calendar, ChevronDown } from 'lucide-react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { AppText, View } from '@/components/Themed';

import {
  AgendaList,
  CalendarProvider,
  ExpandableCalendar,
  WeekCalendar,
} from 'react-native-calendars';
import { Theme } from 'react-native-calendars/src/types';

interface Props {
  weekView?: boolean;
}

const fetchReleasesByMonth = async (month: string) =>
  await api.get(`games/releases?month=${month}`).json<ListGame[]>();

const date = new Date();

const initialDate = new Date(date.getFullYear(), date.getMonth(), 2)
  .toISOString()
  .split('T')[0]; // "YYYY-MM-DD"

const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0);
const todayDateString = todayDate.toISOString().split('T')[0];

const initialMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"

const ExpandableCalendarScreen = ({ weekView }: Props) => {
  const listRef = useRef<React.LegacyRef<unknown>>(null);
  const calendarRef = useRef<{ toggleCalendarPosition: () => boolean }>(null);
  const rotation = useRef(new Animated.Value(0));
  const { colors, isDarkMode } = useTheme();

  const [selectedDate, setSelectedDate] = useState<string>(todayDateString);
  const [visibleMonth, setVisibleMonth] = useState<string>(initialMonth);
  const [shouldShowPast, setShouldShowPast] = useState<boolean>(false);

  // TODO: Move this to a custom hook
  const {
    data: games,
    isLoading,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['game-releases', visibleMonth],
    queryFn: () => fetchReleasesByMonth(visibleMonth),
  });

  const transformedItems = useMemo(() => {
    if (!games) return [];

    const grouped: Record<string, ListGame[]> = {};

    games.forEach((game: ListGame) => {
      if (!game.first_release_date) return; // Skip if no release date
      const releaseDate = new Date(game.first_release_date * 1000);
      releaseDate.setHours(0, 0, 0, 0);
      if (releaseDate < todayDate && !shouldShowPast) return;
      const dateStr = releaseDate.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!grouped[dateStr]) grouped[dateStr] = [];

      grouped[dateStr].push(game);
    });

    return Object.entries(grouped).map(([date, data]) => ({
      title: date,
      data,
    }));
  }, [games, shouldShowPast]);

  const marked = useMemo(() => {
    if (!games) return {};

    return games.reduce((acc: any, game: any) => {
      const dateStr = new Date(game.first_release_date * 1000)
        .toISOString()
        .split('T')[0];
      acc[dateStr] = { marked: true };
      return acc;
    }, {});
  }, [games]);

  // Placeholder AgendaItem component
  const AgendaItem = ({ item }: { item: ListGame }) => (
    <TouchableOpacity onPress={() => router.navigate(`/games/${item.id}`)}>
      <View
        style={StyleSheet.flatten([
          styles.agendaItem,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ])}
      >
        {item.cover && item.cover.url ? (
          <Image
            source={{
              uri: imageLoader({
                imgSrc: item.cover.url,
                quality: 1,
              }),
            }}
            style={styles.agendaImage}
          />
        ) : null}
        <AppText style={styles.agendaText}>{item.name}</AppText>
        <AppText
          style={{ color: colors.textSecondary, fontSize: 12, maxWidth: 100 }}
          numberOfLines={1}
        >
          {item.platforms?.map((p) => p.name).join(', ') || 'Unknown Platform'}
        </AppText>
      </View>
    </TouchableOpacity>
  );

  const toggleCalendarExpansion = useCallback(() => {
    const isOpen = calendarRef.current?.toggleCalendarPosition();
    Animated.timing(rotation.current, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, []);

  const renderHeader = useCallback(
    (date?: any) => {
      const rotationInDegrees = rotation.current.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-180deg'],
      });

      return (
        <TouchableOpacity
          style={styles.header}
          onPress={toggleCalendarExpansion}
        >
          <AppText style={styles.headerTitle}>
            {date?.toString?.('MMMM yyyy') ?? ''}
          </AppText>
          <Animated.View style={{ transform: [{ rotate: rotationInDegrees }] }}>
            <ChevronDown size={18} />
          </Animated.View>
        </TouchableOpacity>
      );
    },
    [isDarkMode],
  );

  const onCalendarToggled = useCallback((isOpen: boolean) => {
    rotation.current.setValue(isOpen ? 1 : 0);
  }, []);

  const onMonthChange = (dateObj: any) => {
    const newMonth = dateObj.dateString.slice(0, 7); // "YYYY-MM"
    setVisibleMonth(newMonth);
  };

  const theme: Theme = {
    monthTextColor: colors.primary,
    backgroundColor: colors.background,
    todayBackgroundColor: colors.surface,
    selectedDayBackgroundColor: colors.primary,

    arrowColor: colors.primary,
    todayButtonTextColor: colors.primary,
    agendaTodayColor: colors.primary,
    todayTextColor: colors.primary,
    indicatorColor: colors.primary,
    calendarBackground: colors.background,
  };

  const isLoadingData = isPending || isLoading;
  const noGamesFound = !isLoadingData && transformedItems.length === 0;

  const NoGames = () => (
    <View style={{ padding: 20, alignItems: 'center' }}>
      <AppText>
        {isError ? 'Error loading games' : 'No games found for this date'}
      </AppText>
    </View>
  );

  const TodayButton = () => {
    return (
      <TouchableOpacity
        onPress={() => setSelectedDate(todayDateString)}
        style={styles.floatingButton}
      >
        <Calendar size={18} color={colors.primary} />
        <AppText style={{ color: colors.primary }}>Today</AppText>
      </TouchableOpacity>
    );
  };

  const ShowPastButton = () => {
    const handlePress = () => {
      // initialDate
      // if
      setShouldShowPast((prev) => !prev);
    };

    return (
      <TouchableOpacity
        onPress={() => setShouldShowPast((prev) => !prev)}
        style={styles.floatingButton}
      >
        <Calendar size={18} color={colors.primary} />
        <AppText style={{ color: colors.primary }}>
          {shouldShowPast ? 'Hide' : 'Show'} Past
        </AppText>
      </TouchableOpacity>
    );
  };

  return (
    <CalendarProvider
      date={selectedDate}
      onDateChanged={(e, src) => {
        setSelectedDate(e);
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          position: 'relative',
        }}
      >
        <View style={styles.buttonWrapper}>
          <ShowPastButton />
          <TodayButton />
        </View>

        {weekView ? (
          <WeekCalendar
            displayLoadingIndicator={isLoadingData}
            theme={theme}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            onMonthChange={onMonthChange}
            firstDay={1}
            markedDates={marked}
          />
        ) : (
          <ExpandableCalendar
            allowShadow
            displayLoadingIndicator={isLoadingData}
            theme={theme}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            onMonthChange={onMonthChange}
            renderHeader={renderHeader}
            ref={calendarRef}
            onCalendarToggled={onCalendarToggled}
            firstDay={1}
            markedDates={marked}
          />
        )}
        <View style={styles.bottomContainer}>
          <AgendaList
            markToday
            ref={listRef}
            sections={transformedItems}
            renderItem={({ item }: { item: ListGame }) => (
              <AgendaItem item={item} />
            )}
            sectionStyle={styles.agendaItemList}
          />

          {noGamesFound ? <NoGames /> : null}
        </View>
      </View>
    </CalendarProvider>
  );
};

export default ExpandableCalendarScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },

  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  agendaItemList: {
    // textTransform: 'capitalize',
  },
  agendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 10,
  },

  agendaImage: {
    width: 35,
    height: 35,
    borderRadius: 4,
  },
  agendaText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  buttonWrapper: {
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },

  floatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
