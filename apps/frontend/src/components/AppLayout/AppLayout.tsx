import { Button, Flex, Text } from '@mantine/core';
import { COLLAPSE_DURATION, routeVariants, SIDEBAR_WIDTH } from './config';

import { Icon, IconLogout, IconSearch } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { FC, ReactElement, ReactNode, useState } from 'react';

import { auth } from '../../utils/auth';
import { SearchGameInput } from '../SearchGameInput';
import styles from './AppLayout.module.scss';
import { LinkOption } from './components/LinkOption';
import { LinksSkeleton } from './components/LinksSkeleton';
import { TitleSection } from './components/TitleSection';
import { ToggleSection } from './components/ToggleSection';

export type IconType = Icon;

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
  const [open, setIsOpen] = useState<boolean>(
    JSON.parse(localStorage.getItem('sidebar') ?? 'true')
  );

  const toggleSidebar = (value: boolean) => {
    localStorage.setItem('sidebar', value.toString());
    setIsOpen(value);
  };

  return (
    <div className={styles.Layout}>
      <Sidebar setOpen={toggleSidebar} open={open} linkItems={linkItems} />
      <motion.main layout transition={{ duration: COLLAPSE_DURATION }} className={styles.Main}>
        {children}
      </motion.main>
    </div>
  );
};

const Sidebar = ({ open, setOpen, linkItems }: SidebarProps) => {
  const isLoading = false;
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
            <SearchGameInput />
          ) : (
            <motion.div layout>
              <Flex h="68px" align="center" justify="center">
                <IconSearch />
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
          <Flex>
            <Text>Logout</Text>
            <Button variant="subtle" onClick={() => auth.logout()}>
              <IconLogout />
            </Button>
          </Flex>
        </motion.div>
        <ToggleSection open={open} setOpen={setOpen} />
      </Flex>
    </motion.nav>
  );
};
