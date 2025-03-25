import { IconDeviceGamepad2 } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { COLLAPSE_DURATION } from '../../config';
import styles from './TitleSection.module.scss';

interface TitleSectionProps {
  open: boolean;
}
export const TitleSection = ({ open }: TitleSectionProps) => (
  <div className={styles.TitleContainer}>
    <motion.div className={styles.TitleSection} layout transition={{ duration: COLLAPSE_DURATION }}>
      <motion.div layout className={styles.LogoContainer}>
        <IconDeviceGamepad2 />
      </motion.div>
      {open && (
        <motion.span layout className={styles.TitleText}>
          Video Games
        </motion.span>
      )}
    </motion.div>
  </div>
);
