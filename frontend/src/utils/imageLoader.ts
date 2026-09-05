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

export interface LoaderProps {
  imgSrc: string; // ** //images.igdb.com/igdb/image/upload/t_thumb/co7497.jpg
  quality?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10; // ** Quality is a number between 1 and 10
  maxSize?: boolean; // ** Max size makes chosen image double size
}

export const imageLoader = ({ imgSrc, quality, maxSize }: LoaderProps) => {
  // oxlint-disable-next-line unicorn/no-useless-undefined -- keeps consistent-return happy
  if (!imgSrc) return undefined;
  const finalSize = quality || 6;
  const qualityObj = sizes.find((size) => size.quality === finalSize);
  const name = qualityObj ? qualityObj.name + (maxSize ? '_2x' : '') : undefined;
  return `https:` + imgSrc.replace(/(t_)\w+/, `t_${name}`);
};
