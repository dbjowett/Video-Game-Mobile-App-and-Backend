import { Box, Button, Collapse, Group, SimpleGrid, Text, UnstyledButton } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { PLATFORM_OPTIONS, PlatformOption } from '@vg/types';
import { useState } from 'react';

import { PlatformIcon } from './PlatformIcon';

interface PlatformPickerProps {
  value: number[];
  onChange: (ids: number[]) => void;
}

const topPlatforms = PLATFORM_OPTIONS.filter((p) => p.tier === 'top');
const morePlatforms = PLATFORM_OPTIONS.filter((p) => p.tier === 'more');

interface PlatformTileProps {
  platform: PlatformOption;
  selected: boolean;
  onToggle: () => void;
}

const PlatformTile = ({ platform, selected, onToggle }: PlatformTileProps) => (
  <UnstyledButton
    onClick={onToggle}
    px="sm"
    py="xs"
    style={{
      borderRadius: 'var(--mantine-radius-md)',
      border: `1px solid ${selected ? 'var(--mantine-color-dark-filled)' : 'var(--mantine-color-default-border)'}`,
      backgroundColor: selected ? 'var(--mantine-color-dark-filled)' : 'transparent',
      color: selected ? 'var(--mantine-color-white)' : 'inherit',
      transition: 'background-color 100ms ease, border-color 100ms ease',
    }}
  >
    <Group gap="xs" wrap="nowrap">
      <Box style={{ flexShrink: 0, display: 'flex' }}>
        <PlatformIcon iconKey={platform.iconKey} size={18} />
      </Box>
      <Text fz="sm" fw={500} truncate style={{ flex: 1, minWidth: 0 }}>
        {platform.name}
      </Text>
    </Group>
  </UnstyledButton>
);

export const PlatformPicker = ({ value, onChange }: PlatformPickerProps) => {
  const [showMore, setShowMore] = useState(false);

  const toggle = (id: number) =>
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);

  return (
    <Box>
      <SimpleGrid cols={3} spacing="xs">
        {topPlatforms.map((platform) => (
          <PlatformTile
            key={platform.id}
            platform={platform}
            selected={value.includes(platform.id)}
            onToggle={() => toggle(platform.id)}
          />
        ))}
      </SimpleGrid>

      <Button
        variant="subtle"
        color="gray"
        size="xs"
        mt="xs"
        rightSection={
          <IconChevronDown
            size={14}
            style={{
              transform: showMore ? 'rotate(180deg)' : undefined,
              transition: 'transform 100ms ease',
            }}
          />
        }
        onClick={() => setShowMore((v) => !v)}
      >
        {showMore ? 'Fewer platforms' : 'More platforms'}
      </Button>

      <Collapse expanded={showMore}>
        <SimpleGrid cols={3} spacing="xs" mt="xs">
          {morePlatforms.map((platform) => (
            <PlatformTile
              key={platform.id}
              platform={platform}
              selected={value.includes(platform.id)}
              onToggle={() => toggle(platform.id)}
            />
          ))}
        </SimpleGrid>
      </Collapse>
    </Box>
  );
};
