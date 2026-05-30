import { Pressable, StyleSheet, Text } from 'react-native';

import { useThemeStore } from '@/state_management/themeStore';
import { darkTheme, lightTheme } from '@/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
}

export function PrimaryButton({ label, onPress }: PrimaryButtonProps) {
  const colorScheme = useThemeStore((s) => s.colorScheme);
  const { colors, spacing } = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.primary,
          opacity: pressed ? 0.85 : 1,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
        },
      ]}
    >
      <Text style={[styles.label, { color: colors.onPrimary }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
