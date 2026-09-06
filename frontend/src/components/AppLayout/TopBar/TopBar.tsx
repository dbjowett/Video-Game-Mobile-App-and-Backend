import { Button, Popover } from '@mantine/core';
import { IconDeviceGamepad2 } from '@tabler/icons-react';
import { DEFAULT_PLATFORM_IDS } from '@vg/types';
import { useEffect, useState } from 'react';

import { useUpdateUserPlatforms } from '../../../hooks/useUpdateUserPlatforms';
import { useUser } from '../../../utils/auth';
import { PlatformPicker } from '../../PlatformPicker/PlatformPicker';

export const TopBar = () => {
  const { data: user } = useUser();
  const [platformIds, setPlatformIds] = useState<number[]>([]);
  const { mutate: savePlatforms } = useUpdateUserPlatforms();

  useEffect(() => {
    if (!user) return;
    const initialPlatformIds =
      user.preferredPlatformIds.length > 0 ? user.preferredPlatformIds : DEFAULT_PLATFORM_IDS;
    // oxlint-disable-next-line react/set-state-in-effect -- seeds editable local state once server data loads
    setPlatformIds(initialPlatformIds);
  }, [user]);

  const handleChange = (ids: number[]) => {
    setPlatformIds(ids);
    savePlatforms(ids);
  };

  return (
    <Popover width={320} position="bottom-end" shadow="md" withArrow>
      <Popover.Target>
        <Button variant="default" size="xs" leftSection={<IconDeviceGamepad2 size={16} />}>
          {platformIds.length} platform{platformIds.length === 1 ? '' : 's'}
        </Button>
      </Popover.Target>
      <Popover.Dropdown p="md">
        <PlatformPicker value={platformIds} onChange={handleChange} />
      </Popover.Dropdown>
    </Popover>
  );
};
