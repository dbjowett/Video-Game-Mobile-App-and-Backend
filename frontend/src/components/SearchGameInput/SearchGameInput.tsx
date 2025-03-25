import { Combobox, Flex, Image, InputBase, Loader, Text, useCombobox } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useGameSearch } from '../../hooks/useGameSearch';

interface Item {
  image: string;
  value: string;
  description: string;
  id: number;
}

function SelectOption({ image, value, description }: Item) {
  return (
    <Flex gap="4px">
      <Image src={image} alt={value} width={40} height={40} radius="md" />
      <Flex direction="column">
        <Text lineClamp={1} fz="sm" fw={500}>
          {value}
        </Text>
        <Text lineClamp={1} fz="xs" opacity={0.6}>
          {description}
        </Text>
      </Flex>
    </Flex>
  );
}

export function SearchGameInput() {
  const navigate = useNavigate();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 300);

  const { data, isLoading, isFetching } = useGameSearch(debouncedQuery);

  if ((data?.length || isLoading) && !combobox.dropdownOpened) combobox.openDropdown();

  const options = (data || []).map((item) => (
    <Combobox.Option
      onClick={() => navigate({ to: `/game/${item.id}` })}
      value={item.value}
      key={item.id}
    >
      <SelectOption {...item} />
    </Combobox.Option>
  ));

  return (
    <Combobox
      position="bottom-start"
      width={320}
      store={combobox}
      withinPortal={true}
      onOptionSubmit={() => combobox.closeDropdown()}
    >
      <Combobox.Target>
        <InputBase
          radius={'md'}
          p="md"
          placeholder="Search for a game..."
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          rightSection={isLoading || isFetching ? <Loader size="xs" /> : null}
          rightSectionPointerEvents="none"
          multiline
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        {isLoading ? (
          <Flex p="sm" gap="xs">
            <Loader size="sm" />
            <Text fz="sm">Loading games...</Text>
          </Flex>
        ) : (
          <Combobox.Options>
            {options.length ? (
              options
            ) : (
              <Text fz="sm" p="4px">
                No results found
              </Text>
            )}
          </Combobox.Options>
        )}
      </Combobox.Dropdown>
    </Combobox>
  );
}
