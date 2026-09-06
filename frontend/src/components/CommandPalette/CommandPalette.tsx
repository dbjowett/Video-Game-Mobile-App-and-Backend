import { Avatar } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Spotlight, SpotlightActionData, SpotlightFilterFunction } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { useGameSearch } from '../../hooks/useGameSearch';

const passThroughFilter: SpotlightFilterFunction = (_query, actions) => actions;

export const CommandPalette = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 300);
  const { data } = useGameSearch(debouncedQuery);

  const actions: SpotlightActionData[] = (data ?? []).map((game) => ({
    id: String(game.id),
    label: game.value,
    description: game.description,
    leftSection: <Avatar src={game.image} size="sm" radius="sm" />,
    onClick: () => void navigate({ to: '/games/$id', params: { id: String(game.id) } }),
  }));

  return (
    <Spotlight
      query={query}
      onQueryChange={setQuery}
      actions={actions}
      filter={passThroughFilter}
      nothingFound="No games found"
      searchProps={{
        leftSection: <IconSearch size={20} />,
        placeholder: 'Search games...',
      }}
    />
  );
};
