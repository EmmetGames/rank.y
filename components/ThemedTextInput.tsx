import { TextInput, StyleSheet, type TextInputProps, Platform } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  onEnterPress?: () => void;
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  onEnterPress,
  ...rest
}: ThemedTextInputProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'inputBackground');
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'inputText');

  return (
    <TextInput
      autoFocus={Platform.OS === 'web'}
      onKeyPress={(e) => {
        if (e.key === 'Enter' && onEnterPress) {
          onEnterPress();
      }}}
      style={[
        styles.default,
        { backgroundColor, color },
        style
      ]}
      placeholderTextColor={color + '99'}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
});
