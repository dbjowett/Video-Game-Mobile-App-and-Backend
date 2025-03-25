import { IconLayoutSidebarRightCollapse } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { COLLAPSE_DURATION } from '../../config/index';
import styles from './ToggleSection.module.scss';

interface ToggleSectionProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}
export const ToggleSection = ({ open, setOpen }: ToggleSectionProps) => {
  return (
    <motion.button
      layout
      transition={{ duration: COLLAPSE_DURATION }}
      onClick={() => setOpen(open ? false : true)}
      className={styles.ToggleButton}
    >
      <div className={styles.ToggleContent}>
        <motion.div layout className={styles.ToggleIconContainer}>
          <IconLayoutSidebarRightCollapse
            size={20}
            className={open ? styles.ToggleIconRotated : styles.ToggleIcon}
          />
        </motion.div>
        {open && (
          <motion.span layout className={styles.ToggleText}>
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};
