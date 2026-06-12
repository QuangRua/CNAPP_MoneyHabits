import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeStore } from '@/state_management/themeStore';
import { darkTheme, lightTheme } from '@/theme';
import { hp, wp } from '@/utils/responsive';
import type { RootStackParamList } from '@/navigation/types';

// Let's import standard expo icons if possible, or use standard text icons since we installed vector-icons
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  const colorScheme = useThemeStore((s) => s.colorScheme);
  const toggleColorScheme = useThemeStore((s) => s.toggleColorScheme);
  const { colors, spacing } = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header theme toggle */}
      <View style={styles.header}>
        <Pressable
          onPress={toggleColorScheme}
          style={({ pressed }) => [
            styles.iconButton,
            {
              backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f2f2f7',
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons
            name={colorScheme === 'dark' ? 'sunny-outline' : 'moon-outline'}
            size={22}
            color={colors.onBackground}
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Logo and App Title */}
        <View style={styles.logoSection}>
          <View style={[styles.logoBg, { backgroundColor: colors.primary }]}>
            <Ionicons name="wallet" size={64} color={colors.onPrimary} />
          </View>
          <Text style={[styles.title, { color: colors.onBackground }]}>MoneyHabits</Text>
          <Text style={[styles.subtitle, { color: colors.outline }]}>
            Quản lý chi tiêu thông minh{"\n"}Rèn luyện thói quen tiết kiệm mỗi ngày
          </Text>
        </View>

        {/* Buttons section */}
        <View style={styles.buttonSection}>
          <Pressable
            onPress={() => navigation.navigate('Login')}
            style={({ pressed }) => [
              styles.primaryBtn,
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.9 : 1,
                marginBottom: spacing.md,
              },
            ]}
          >
            <Text style={[styles.primaryBtnText, { color: colors.onPrimary }]}>
              Đăng nhập
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('Register')}
            style={({ pressed }) => [
              styles.secondaryBtn,
              {
                borderColor: colors.primary,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text style={[styles.secondaryBtnText, { color: colors.primary }]}>
              Tạo tài khoản mới
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.outline }]}>
          Phiên bản 1.0.0 • HK2A Team
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: hp(6),
  },
  logoBg: {
    width: 120,
    height: 120,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonSection: {
    width: '100%',
    maxWidth: 320,
  },
  primaryBtn: {
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    height: 54,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
});
