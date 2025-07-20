import { AppText, TextProps } from './Themed';

export function MonoText(props: TextProps) {
  return (
    <AppText {...props} style={[props.style, { fontFamily: 'SpaceMono' }]} />
  );
}

export function BlueText(props: TextProps) {
  return (
    <AppText
      {...props}
      style={[
        props.style,
        {
          color: '#007AFF',
          fontSize: 17,
          fontWeight: '500',
          paddingVertical: 12,
          textAlign: 'center',
        },
      ]}
    />
  );
}
