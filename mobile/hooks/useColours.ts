import { useColourScheme } from '@/components/useColourScheme';
import Colours from '@/constants/Colours';

export const useColours = () => Colours[useColourScheme() || 'light'];
