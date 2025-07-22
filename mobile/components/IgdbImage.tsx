import { imageLoader, LoaderProps } from '@/utils';
import { Image, ImageProps } from 'react-native';
import Animated from 'react-native-reanimated';

interface IgdbImageProps extends ImageProps, LoaderProps {}

export function IgdbImage(props: IgdbImageProps) {
  const { imgSrc, quality, ...rest } = props;

  const fullImage = imageLoader({
    imgSrc,
    quality,
  });

  return <Image source={{ uri: fullImage }} {...rest} />;
}

export function AnimatedIgdbImage(props: IgdbImageProps) {
  const { imgSrc, quality, ...rest } = props;

  const fullImage = imageLoader({
    imgSrc,
    quality,
  });

  return <Animated.Image src={fullImage} {...rest} />;
}
