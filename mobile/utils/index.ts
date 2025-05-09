// ** To use, add "t_" to each, "thumb" -> "t_thumb"
const sizes = [
  { quality: 1, name: 'micro', size: '35 x 35' }, // Fit
  { quality: 2, name: 'thumb', size: '90 x 90' }, // Lfill, Center gravity
  { quality: 3, name: 'cover_small', size: '90 x 128' }, // Fit
  { quality: 4, name: 'logo_med', size: '284 x 160' }, // Fit
  { quality: 5, name: 'screenshot_med', size: '569 x 320' }, // Lfill, Center gravity
  { quality: 6, name: 'cover_big', size: '264 x 374' }, // Lfill, Center gravity
  { quality: 7, name: 'screenshot_big', size: '889 x 500' }, // Thumb, Center gravity
  { quality: 8, name: 'screenshot_huge', size: '1280 x 720' }, // Thumb, Center gravity
  { quality: 9, name: '720p', size: '1280 x 720' }, // Fit, Center gravity
  { quality: 10, name: '1080p', size: '1920 x 1080' }, // Fit, Center gravity
];

interface LoaderProps {
  src: string; // ** //images.igdb.com/igdb/image/upload/t_thumb/co7497.jpg
  quality?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10; // ** Quality is a number between 1 and 10
  maxSize?: boolean; // ** Max size makes chosen image double size
}

export const imageLoader = ({ src, quality, maxSize }: LoaderProps) => {
  const finalSize = quality ? quality : 6;
  const qualityObj = sizes.find((size) => size.quality === finalSize);
  const name = qualityObj?.name.concat(maxSize ? '_2x' : '');
  return `https:` + src.replace(/(t_)\w+/, `t_${name}`);
};

export const heroImageLoader = (src: string) => {
  const size = '1080p';
  const quality = `${size}_2x`;
  return src.replace(/(t_)\w+/, `$1${quality}`);
};

export const getId = (id: string | string[]): string => {
  const gameId = Array.isArray(id) ? id.find((item) => item !== 'games') : id;
  return gameId ?? '';
};

const websiteCategoryMap: Record<number, string> = {
  1: 'Official',
  2: 'Wikia',
  3: 'Wikipedia',
  4: 'Facebook',
  5: 'Twitter',
  6: 'Twitch',
  8: 'Instagram',
  9: 'YouTube',
  10: 'iPhone',
  11: 'iPad',
  12: 'Android',
  13: 'Steam',
  14: 'Reddit',
  15: 'Discord',
  16: 'Google Plus',
  17: 'Tumblr',
  18: 'LinkedIn',
  19: 'Pinterest',
  20: 'SoundCloud',
};

export const getObjectCategoryName = (categoryId: number): string | undefined => {
  return websiteCategoryMap[categoryId];
};
