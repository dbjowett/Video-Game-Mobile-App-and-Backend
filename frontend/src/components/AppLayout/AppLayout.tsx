import { Divider, Flex } from '@mantine/core';
import { COLLAPSE_DURATION, routeVariants, SIDEBAR_WIDTH } from './config';

import { Icon } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { FC, ReactElement, ReactNode, useState } from 'react';

import styles from './AppLayout.module.scss';
import { LinkOption } from './components/LinkOption';
import { LinksSkeleton } from './components/LinksSkeleton';
import { TitleSection } from './components/TitleSection';
import { ToggleSection } from './components/ToggleSection/';

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
  const [settingsView, setSettingsView] = useState<boolean>(false);
  const isLoading = false;

  return (
    <motion.nav
      layout
      transition={{ duration: COLLAPSE_DURATION }}
      className={styles.Sidebar}
      style={{
        width: open ? SIDEBAR_WIDTH : 'fit-content',
      }}
    >
      <Flex direction="column" h="100%" justify="space-between">
        <motion.div layout style={{ height: '100%' }}>
          <TitleSection open={open} />

          <div className={styles.NavigationWrapper}>
            <motion.div
              animate={settingsView ? 'hidden' : 'visible'}
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
                        {path.toLowerCase().includes('settings') && <Divider mb="xs" />}
                        <LinkOption
                          key={path}
                          Icon={Icon}
                          title={content}
                          open={open}
                          path={path}
                          onClick={() => {
                            if (!path.includes('settings')) return;
                            setSettingsView(true);
                          }}
                        />
                      </motion.div>
                    ))}
                  </>
                )}
              </>
            </motion.div>
          </div>
        </motion.div>

        <ToggleSection open={open} setOpen={setOpen} />
      </Flex>
    </motion.nav>
  );
};
