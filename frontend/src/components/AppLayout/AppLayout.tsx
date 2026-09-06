import { ActionIcon, Flex, Group, Kbd, Popover, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { spotlight } from '@mantine/spotlight';
import { IconLogout, IconSearch } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { FC, ReactElement, ReactNode, useState } from 'react';

import { auth } from '../../utils/auth';
import { LinkOption } from './components/LinkOption';
import { LinksSkeleton } from './components/LinksSkeleton';
import { TitleSection } from './components/TitleSection';
import { ToggleSection } from './components/ToggleSection';
import { COLLAPSE_DURATION, routeVariants, SIDEBAR_WIDTH } from './config';
import { TopBar } from './TopBar/TopBar';
import { IconType } from './types';

import styles from './AppLayout.module.scss';

interface ILinkItem {
  path: string;
  Icon?: IconType;
  content: string | ReactElement;
}

interface LayoutProps {
  children: ReactNode;
  linkItems: ILinkItem[];
}
interface SidebarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  linkItems: ILinkItem[];
}

export const DashboardLayout: FC<LayoutProps> = ({ children, linkItems }) => {
  const [open, setIsOpen] = useState<boolean>(localStorage.getItem('sidebar') !== 'false');

  const toggleSidebar = (value: boolean) => {
    localStorage.setItem('sidebar', value.toString());
    setIsOpen(value);
  };

  return (
    <div className={styles.Layout}>
      <Sidebar setOpen={toggleSidebar} open={open} linkItems={linkItems} />
      <motion.main layout transition={{ duration: COLLAPSE_DURATION }} className={styles.Main}>
        <div className={styles.TopBar}>
          <TopBar />
        </div>
        {children}
      </motion.main>
    </div>
  );
};

const Sidebar = ({ open, setOpen, linkItems }: SidebarProps) => {
  const isLoading = false;
  const [searchTooltipOpened, { open: openSearchTooltip, close: closeSearchTooltip }] =
    useDisclosure(false);
  const [logoutTooltipOpened, { open: openLogoutTooltip, close: closeLogoutTooltip }] =
    useDisclosure(false);

  return (
    <motion.nav
      layout
      transition={{ duration: COLLAPSE_DURATION }}
      className={styles.Sidebar}
      style={{ width: open ? SIDEBAR_WIDTH : 'fit-content' }}
    >
      <Flex direction="column" h="100%" justify="space-between">
        <motion.div layout style={{ height: '100%' }}>
          <TitleSection open={open} />
          {open ? (
            <Flex px="sm" py="xs">
              <UnstyledButton
                onClick={() => spotlight.open()}
                p="8px 12px"
                w="100%"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--mantine-radius-md)',
                  border: '1px solid var(--mantine-color-default-border)',
                }}
              >
                <Group gap="xs">
                  <IconSearch size={16} />
                  <Text c="dimmed" fz="sm">
                    Search...
                  </Text>
                </Group>
                <Kbd size="xs">⌘K</Kbd>
              </UnstyledButton>
            </Flex>
          ) : (
            <motion.div layout>
              <Flex h="68px" align="center" justify="center">
                <Popover opened={searchTooltipOpened} position="right" withArrow offset={10}>
                  <Popover.Target>
                    <ActionIcon
                      variant="subtle"
                      size="lg"
                      onClick={() => spotlight.open()}
                      onMouseEnter={openSearchTooltip}
                      onMouseLeave={closeSearchTooltip}
                    >
                      <IconSearch size={20} />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown bg="black" p="8px 12px">
                    <Text c="white" fz="sm" fw="600">
                      Search
                    </Text>
                  </Popover.Dropdown>
                </Popover>
              </Flex>
            </motion.div>
          )}
          <div className={styles.NavigationWrapper}>
            <motion.div
              animate={'visible'}
              variants={routeVariants}
              initial="visible"
              className={styles.OptionsContainer}
            >
              <>
                {isLoading ? (
                  <LinksSkeleton isOpen={open} />
                ) : (
                  <>
                    {linkItems.map(({ path, Icon, content }) => (
                      <motion.div layout key={path}>
                        <LinkOption
                          key={path}
                          Icon={Icon}
                          title={content}
                          open={open}
                          path={path}
                        />
                      </motion.div>
                    ))}
                  </>
                )}
              </>
            </motion.div>
          </div>
        </motion.div>
        <motion.div layout>
          {open ? (
            <Flex align="center" justify="space-between" px="sm">
              <Text>Logout</Text>
              <ActionIcon variant="subtle" size="lg" onClick={() => void auth.logout()}>
                <IconLogout size={20} />
              </ActionIcon>
            </Flex>
          ) : (
            <Flex justify="center" py="xs">
              <Popover opened={logoutTooltipOpened} position="right" withArrow offset={10}>
                <Popover.Target>
                  <ActionIcon
                    variant="subtle"
                    size="lg"
                    onClick={() => void auth.logout()}
                    onMouseEnter={openLogoutTooltip}
                    onMouseLeave={closeLogoutTooltip}
                  >
                    <IconLogout size={20} />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown bg="black" p="8px 12px">
                  <Text c="white" fz="sm" fw="600">
                    Logout
                  </Text>
                </Popover.Dropdown>
              </Popover>
            </Flex>
          )}
        </motion.div>
        <ToggleSection open={open} setOpen={setOpen} />
      </Flex>
    </motion.nav>
  );
};
