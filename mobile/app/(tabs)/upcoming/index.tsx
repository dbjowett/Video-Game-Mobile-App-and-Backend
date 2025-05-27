import { ListGame } from '@/api/types/game';
import { api } from '@/api/utils/api';
import { imageLoader } from '@/utils';
import { useHeaderHeight } from '@react-navigation/elements';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ChevronDown } from 'lucide-react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  AgendaList,
  CalendarProvider,
  ExpandableCalendar,
  WeekCalendar,
} from 'react-native-calendars';

interface Props {
  weekView?: boolean;
}

const fetchReleasesByMonth = async (month: string) =>
  await api.get(`games/releases?month=${month}`).json<ListGame[]>();

// Placeholder AgendaItem component
const AgendaItem = ({ item }: { item: ListGame }) => (
  <TouchableOpacity
    onPress={() => {
      router.navigate(`/games/${item.id}`);
    }}
  >
    <View style={styles.agendaItem}>
      {item.cover && item.cover.url ? (
        <Image
          source={{
            uri: imageLoader({
              src: item.cover.url,
              quality: 1,
            }),
          }}
          style={styles.agendaImage}
        />
      ) : null}
      <Text style={styles.agendaText}>{item.name}</Text>
    </View>
  </TouchableOpacity>
);

const initialDate = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
const initialMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"

const ExpandableCalendarScreen = ({ weekView }: Props) => {
  const headerHeight = useHeaderHeight();
  const calendarRef = useRef<{ toggleCalendarPosition: () => boolean }>(null);
  const rotation = useRef(new Animated.Value(0));

  const [selectedDate, setSelectedDate] = React.useState<string>(initialDate);
  const [visibleMonth, setVisibleMonth] = useState<string>(initialMonth);

  const {
    data: games,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['game-releases', visibleMonth],
    queryFn: () => fetchReleasesByMonth(visibleMonth),
    // staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const transformedItems = useMemo(() => {
    if (!games) return [];

    const grouped: Record<string, ListGame[]> = {};

    games.forEach((game: ListGame) => {
      if (!game.first_release_date) return; // Skip if no release date
      const releaseDate = new Date(game.first_release_date * 1000);
      const dateStr = releaseDate.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!grouped[dateStr]) grouped[dateStr] = [];

      grouped[dateStr].push(game);
    });

    return Object.entries(grouped).map(([date, data]) => ({ title: date, data }));
  }, [games]);

  const marked = useMemo(() => {
    if (!games) return {};

    return games.reduce((acc: any, game: any) => {
      const dateStr = new Date(game.first_release_date * 1000).toISOString().split('T')[0];
      acc[dateStr] = { marked: true };
      return acc;
    }, {});
  }, [games]);
  const renderItem = useCallback(({ item }: { item: ListGame }) => {
    return <AgendaItem item={item} />;
  }, []);

  const toggleCalendarExpansion = useCallback(() => {
    const isOpen = calendarRef.current?.toggleCalendarPosition();
    Animated.timing(rotation.current, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, []);

  const renderHeader = useCallback((date?: any) => {
    const rotationInDegrees = rotation.current.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-180deg'],
    });

    return (
      <TouchableOpacity style={styles.header} onPress={toggleCalendarExpansion}>
        <Text style={styles.headerTitle}>{date?.toString?.('MMMM yyyy') ?? ''}</Text>
        <Animated.View style={{ transform: [{ rotate: rotationInDegrees }] }}>
          <ChevronDown size={18} />
        </Animated.View>
      </TouchableOpacity>
    );
  }, []);

  const onCalendarToggled = useCallback((isOpen: boolean) => {
    rotation.current.setValue(isOpen ? 1 : 0);
  }, []);

  const onMonthChange = (dateObj: any) => {
    const newMonth = dateObj.dateString.slice(0, 7); // "YYYY-MM"
    setVisibleMonth(newMonth);
  };

  return (
    <CalendarProvider date={selectedDate} showTodayButton>
      <View style={{}}>
        {weekView ? (
          <WeekCalendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            onMonthChange={onMonthChange}
            animateScroll
            firstDay={1}
            markedDates={marked}
          />
        ) : (
          <ExpandableCalendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            onMonthChange={onMonthChange}
            renderHeader={renderHeader}
            ref={calendarRef}
            onCalendarToggled={onCalendarToggled}
            firstDay={1}
            markedDates={marked}
          />
        )}
        <AgendaList
          sections={transformedItems}
          renderItem={renderItem}
          sectionStyle={styles.section}
        />
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
    marginRight: 6,
  },
  section: {
    // borderWidth: 10,
    // borderColor: '#ddd',
    // borderRadius: 8,
    backgroundColor: '#f1f1f1',
    color: 'grey',
    textTransform: 'capitalize',
  },
  agendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
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
});
