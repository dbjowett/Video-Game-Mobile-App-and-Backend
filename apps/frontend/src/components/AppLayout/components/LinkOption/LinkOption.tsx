import { Popover, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { motion } from 'motion/react';
import { JSX } from 'react';
import { COLLAPSE_DURATION } from '../../config/index';

import { Link } from '@tanstack/react-router';
import { IconType } from '../../AppLayout';
import styles from './LinkOption.module.scss';

interface OptionProps {
  Icon?: IconType;
  title: string | JSX.Element;
  open?: boolean;
  notifs?: number;
  path: string;
  onClick?: (arg: string) => void;
  isCategory?: boolean;
}

export const LinkOption = ({ Icon, title, open, path, onClick, isCategory }: OptionProps) => {
  const [opened, { close, open: openTooltip }] = useDisclosure(false);
  return (
    <Link
      to={path}
      style={{ width: '100%' }}
      // className={({ isActive }) =>
      //   classNames({ [styles.Selected]: isActive, [styles.Category]: isCategory })
      // }
      onClick={() => {
        if (onClick) onClick(path);
      }}
    >
      <motion.div
        layout
        transition={{ duration: COLLAPSE_DURATION }}
        className={styles.OptionDefault}
      >
        <Popover opened={opened && !open} position="right" withArrow offset={10}>
          <motion.div layout className={styles.IconContainer}>
            {Icon && (
              <Popover.Target>
                <Icon size={24} stroke={1.5} onMouseEnter={openTooltip} onMouseLeave={close} />
              </Popover.Target>
            )}
            <Popover.Dropdown bg="black" p="8px 12px">
              <Text c="white" fz="sm" fw="600">
                {title}
              </Text>
            </Popover.Dropdown>
          </motion.div>
        </Popover>
        {open && (
          <motion.span layout className={styles.OptionTitle}>
            {title}
          </motion.span>
        )}
      </motion.div>
    </Link>
  );
};
