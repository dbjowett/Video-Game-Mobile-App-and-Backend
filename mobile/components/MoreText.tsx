import { useTheme } from '@/theme/theme-context';
import React, { useState } from 'react';
import { Text, TextLayoutLine, TextProps } from 'react-native';

interface ReadMoreTextProps extends TextProps {
  text: string;
  numberOfLines?: number;
  readMoreText?: string;
  readLessText?: string;
  readMoreStyle?: object;
  readLessStyle?: object;
}

export const MoreText = ({
  text,
  style,
  numberOfLines = 5,
  readMoreText = 'more',
  readLessText = 'less',
  readMoreStyle,
  readLessStyle,
  ...props
}: ReadMoreTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [truncatedLength, setTruncatedLength] = useState<number | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const { colors } = useTheme();

  const handleTextLayout = (lines: TextLayoutLine[]) => {
    if (truncatedLength !== null) return; // already calculated

    if (lines.length > numberOfLines) {
      let length = 0;
      for (let i = 0; i < numberOfLines; i++) {
        length += lines[i].text.length;
      }
      setTruncatedLength(length);
      setIsTruncated(true);
    } else {
      setTruncatedLength(text.length);
      setIsTruncated(false);
    }
  };

  return (
    <>
      {/* Hidden text for iOS measurement */}
      <Text
        style={{ height: 0 }}
        onTextLayout={(e) => handleTextLayout(e.nativeEvent.lines)}
      >
        {text}
      </Text>

      {/* Display text */}
      <Text
        style={style}
        numberOfLines={truncatedLength === null ? numberOfLines : undefined}
        {...props}
      >
        {isTruncated && !isExpanded && truncatedLength !== null
          ? `${text.slice(0, truncatedLength - 10).trim()}...`
          : text}
        {isTruncated && (
          <Text
            style={[
              { color: colors.primary, fontWeight: 500 },
              isExpanded ? readLessStyle : readMoreStyle,
            ]}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            {' '}
            {isExpanded ? readLessText : readMoreText}
          </Text>
        )}
      </Text>
    </>
  );
};
