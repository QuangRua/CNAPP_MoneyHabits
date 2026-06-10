import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { HelloWorldCard } from '@/components/HelloWorldCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { helloService } from '@/services/helloService';
import { useThemeStore } from '@/state_management/themeStore';
import { darkTheme, lightTheme } from '@/theme';
import { hp } from '@/utils/responsive';
import type { RootStackParamList } from '@/navigation/types';
import { Ionicons } from '@expo/vector-icons';

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [message, setMessage] = useState('Hello World');
  const colorScheme = useThemeStore((s) => s.colorScheme);
  const toggleColorScheme = useThemeStore((s) => s.toggleColorScheme);
  const { colors, spacing } = colorScheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    helloService.fetchMessage().then((res) => setMessage(res.message));
  }, []);

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['left', 'right', 'bottom']}
    >
      {/* Header with theme toggle and logout */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.onBackground }]}>Dashboard</Text>
        <View style={styles.headerActions}>
          <Pressable
            onPress={toggleColorScheme}
            style={({ pressed }) => [
              styles.iconButton,
              {
                backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f2f2f7',
                opacity: pressed ? 0.7 : 1,
                marginRight: 10,
              },
            ]}
          >
            <Ionicons
              name={colorScheme === 'dark' ? 'sunny-outline' : 'moon-outline'}
              size={20}
              color={colors.onBackground}
            />
          </Pressable>
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.iconButton,
              {
                backgroundColor: '#ff4d4f20',
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons name="log-out-outline" size={20} color="#ff4d4f" />
          </Pressable>
        </View>
      </View>

      <View style={[styles.content, { padding: spacing.lg }]}>
        <HelloWorldCard message={message} />
        <View style={styles.cardContainer}>
          <Text style={[styles.cardTitle, { color: colors.onBackground }]}>Xác thực thành công!</Text>
          <Text style={[styles.cardBody, { color: colors.outline }]}>
            Bạn đã đăng nhập thành công vào hệ thống. Các chức năng của trang Dashboard đang được phát triển ở các issue tiếp theo.
          </Text>
        </View>
        <View style={{ marginTop: spacing.xl }}>
          <PrimaryButton label="Đổi màu giao diện" onPress={toggleColorScheme} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  cardContainer: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    backgroundColor: 'transparent',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
  },
});
