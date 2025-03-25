import { Flex, Skeleton } from '@mantine/core';
import { Fragment } from 'react/jsx-runtime';

interface Props {
  count?: number;
  isOpen?: boolean;
}

export const LinksSkeleton = ({ count = 8, isOpen }: Props) => {
  const iconSize = isOpen ? 28 : 32;
  return (
    <Flex direction="column" gap="12px">
      {Array.from({ length: count }).map((_, index) => (
        <Fragment key={index}>
          <Flex align="center" gap={8}>
            <Skeleton color="var(--colour-selection)" h={iconSize} w={iconSize} radius="md" />
            {isOpen && <Skeleton color="var(--colour-selection)" height={26} radius="md" />}
          </Flex>
        </Fragment>
      ))}
    </Flex>
  );
};
