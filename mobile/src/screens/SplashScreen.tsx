import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as SplashScreenExpo from 'expo-splash-screen';
import { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';

import { authService } from '@/services/authService';
import { useAppStore } from '@/state_management/appStore';
import { useAuthStore } from '@/state_management/authStore';
import { useThemeStore } from '@/state_management/themeStore';
import { darkTheme, lightTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';

import type { RootStackParamList } from '@/navigation/types';

SplashScreenExpo.preventAutoHideAsync().catch(() => undefined);

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const MIN_SPLASH_MS = 1500;

export function SplashScreen({ navigation }: Props) {
  const colorScheme = useThemeStore((s) => s.colorScheme);
  const setReady = useAppStore((s) => s.setReady);
  const setHydrated = useAuthStore((s) => s.setHydrated);
  const hasNavigated = useRef(false);
  const { colors } = colorScheme === 'dark' ? darkTheme : lightTheme;

  const finishBootstrap = useCallback(async () => {
    if (hasNavigated.current) {
      return;
    }
    hasNavigated.current = true;

    const startedAt = Date.now();
    const session = await authService.restoreSession();
    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(0, MIN_SPLASH_MS - elapsed);

    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }

    setHydrated(true);
    setReady(true);
    await SplashScreenExpo.hideAsync().catch(() => undefined);

    if (session.isAuthenticated) {
      navigation.replace('Dashboard');
      return;
    }

    navigation.replace('Welcome');
  }, [navigation, setHydrated, setReady]);

  useEffect(() => {
    finishBootstrap();
  }, [finishBootstrap]);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <View style={styles.logoContainer}>
        <Ionicons name="wallet-sharp" size={80} color={colors.onPrimary} style={styles.icon} />
        <Text style={[styles.logoText, { color: colors.onPrimary }]}>MoneyHabits</Text>
      </View>
      <ActivityIndicator size="small" color={colors.onPrimary} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    marginBottom: 16,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 1,
  },
  loader: {
    position: 'absolute',
    bottom: 60,
  },
});
