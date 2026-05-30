import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as SplashScreenExpo from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAppStore } from '@/state_management/appStore';
import { useThemeStore } from '@/state_management/themeStore';
import { darkTheme, lightTheme } from '@/theme';

import type { RootStackParamList } from '@/navigation/types';

SplashScreenExpo.preventAutoHideAsync().catch(() => undefined);

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SPLASH_DELAY_MS = 1500;

export function SplashScreen({ navigation }: Props) {
  const colorScheme = useThemeStore((s) => s.colorScheme);
  const setReady = useAppStore((s) => s.setReady);
  const { colors } = colorScheme === 'dark' ? darkTheme : lightTheme;

  const finishSplash = useCallback(async () => {
    setReady(true);
    await SplashScreenExpo.hideAsync().catch(() => undefined);
    navigation.replace('Home');
  }, [navigation, setReady]);

  useEffect(() => {
    const timer = setTimeout(finishSplash, SPLASH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [finishSplash]);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <ActivityIndicator size="large" color={colors.onPrimary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
