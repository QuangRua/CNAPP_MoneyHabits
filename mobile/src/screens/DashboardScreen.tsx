import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { HelloWorldCard } from '@/components/HelloWorldCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { RootStackParamList } from '@/navigation/types';
import { helloService } from '@/services/helloService';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/state_management/authStore';
import { useThemeStore } from '@/state_management/themeStore';
import { darkTheme, lightTheme } from '@/theme';
import { hp } from '@/utils/responsive';

export function DashboardScreen() {
  const [message, setMessage] = useState('Xin chào!');
  const [loggingOut, setLoggingOut] = useState(false);
  const [pickingImage, setPickingImage] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAuthStore((s) => s.user);
  const colorScheme = useThemeStore((s) => s.colorScheme);
  const toggleColorScheme = useThemeStore((s) => s.toggleColorScheme);
  const { colors, spacing, typography } =
    colorScheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    helloService.fetchMessage().then((res) => setMessage(res.message));
  }, []);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await authService.logout();
    } finally {
      setLoggingOut(false);
    }
  }, []);

  // Request camera permissions and take photo
  const handleTakePhoto = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPermission.granted) {
        Alert.alert('Quyền truy cập', 'Bạn cần cấp quyền truy cập camera để sử dụng tính năng này.');
        return;
      }

      setPickingImage(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        navigation.navigate('ImagePreview', { imageUri: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể khởi động camera.');
    } finally {
      setPickingImage(false);
    }
  };

  // Request library permissions and pick photo
  const handleSelectPhoto = async () => {
    try {
      const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!libraryPermission.granted) {
        Alert.alert('Quyền truy cập', 'Bạn cần cấp quyền truy cập thư viện ảnh để sử dụng tính năng này.');
        return;
      }

      setPickingImage(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        navigation.navigate('ImagePreview', { imageUri: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể mở thư viện ảnh.');
    } finally {
      setPickingImage(false);
    }
  };

  // Show selection dialog
  const handleImageExpensePress = () => {
    Alert.alert(
      'Quản lý chi tiêu bằng hình ảnh',
      'Chọn phương thức để tải lên ảnh hóa đơn chi tiêu:',
      [
        { text: 'Chụp ảnh mới', onPress: handleTakePhoto },
        { text: 'Chọn từ thư viện', onPress: handleSelectPhoto },
        { text: 'Hủy', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['left', 'right', 'bottom']}
    >
      <View style={[styles.content, { padding: spacing.lg, paddingTop: hp(4) }]}>
        <Text style={typography.headline}>Dashboard</Text>
        {user ? (
          <Text style={[typography.body, { marginTop: spacing.sm }]}>
            {user.name ?? user.email}
          </Text>
        ) : null}

        <View style={{ marginTop: spacing.xl }}>
          <HelloWorldCard message={message} />
        </View>

        <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
          {/* Custom Premium Image Scanner Button */}
          <Pressable
            onPress={handleImageExpensePress}
            disabled={pickingImage}
            style={({ pressed }) => [
              styles.imageBtn,
              {
                backgroundColor: colors.primary,
                opacity: pressed || pickingImage ? 0.85 : 1,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.lg,
              },
            ]}
          >
            <Ionicons name="camera-outline" size={22} color={colors.onPrimary} style={styles.btnIcon} />
            <Text style={[styles.imageBtnText, { color: colors.onPrimary }]}>
              Chi tiêu bằng hình ảnh
            </Text>
          </Pressable>

          <PrimaryButton
            label="Lich su giao dich"
            onPress={() => navigation.navigate('TransactionHistory')}
          />
          <PrimaryButton label="Toggle theme" onPress={toggleColorScheme} />
          <PrimaryButton
            label="Đăng xuất"
            onPress={handleLogout}
            loading={loggingOut}
            disabled={loggingOut}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  imageBtn: {
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  btnIcon: {
    marginRight: 8,
  },
});
