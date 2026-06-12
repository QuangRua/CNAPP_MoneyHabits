import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useMemo } from 'react';

import { DashboardScreen } from '@/screens/DashboardScreen';
import { LoginScreen } from '@/screens/LoginScreen';
import { SplashScreen } from '@/screens/SplashScreen';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import { RegisterScreen } from '@/screens/RegisterScreen';
import { TransactionHistoryScreen } from '@/screens/TransactionHistoryScreen';
import { ImagePreviewScreen } from '@/screens/ImagePreviewScreen';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/state_management/authStore';
import { useThemeStore } from '@/state_management/themeStore';
import { darkColors, lightColors } from '@/theme/colors';

import { navigationRef, navigateToLogin } from './navigationRef';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const colorScheme = useThemeStore((s) => s.colorScheme);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  useEffect(() => {
    authService.configureApiClientHandlers();
  }, []);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      const currentRoute = navigationRef.getCurrentRoute()?.name;
      if (currentRoute === 'Dashboard' || currentRoute === 'TransactionHistory' || currentRoute === 'ImagePreview') {
        navigateToLogin();
      }
    }
  }, [isAuthenticated, isHydrated]);

  const navigationTheme = useMemo(
    () => ({
      ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
      colors: {
        ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.onBackground,
        border: colors.outline,
      },
    }),
    [colorScheme, colors],
  );

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: true,
          animation: 'fade',
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false, animation: 'fade' }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Dashboard', headerBackVisible: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="TransactionHistory"
          component={TransactionHistoryScreen}
          options={{ title: 'Lich su giao dich' }}
        />
        <Stack.Screen
          name="ImagePreview"
          component={ImagePreviewScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
