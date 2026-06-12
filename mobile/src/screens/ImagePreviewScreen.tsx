import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, Image, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { useThemeStore } from '@/state_management/themeStore';
import { darkTheme, lightTheme } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import { hp, wp } from '@/utils/responsive';

type Props = NativeStackScreenProps<RootStackParamList, 'ImagePreview'>;

export function ImagePreviewScreen({ route, navigation }: Props) {
  const { imageUri } = route.params;
  const [currentUri, setCurrentUri] = useState(imageUri);
  const [loading, setLoading] = useState(false);

  const colorScheme = useThemeStore((s) => s.colorScheme);
  const { colors, spacing, typography } = colorScheme === 'dark' ? darkTheme : lightTheme;

  // Function to request permissions and open camera
  const handleTakePhoto = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPermission.granted) {
        Alert.alert('Quyền truy cập', 'Bạn cần cấp quyền truy cập camera để sử dụng tính năng này.');
        return;
      }

      setLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCurrentUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể khởi động camera.');
    } finally {
      setLoading(false);
    }
  };

  // Function to request permissions and open library
  const handleSelectPhoto = async () => {
    try {
      const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!libraryPermission.granted) {
        Alert.alert('Quyền truy cập', 'Bạn cần cấp quyền truy cập thư viện để sử dụng tính năng này.');
        return;
      }

      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCurrentUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể mở thư viện ảnh.');
    } finally {
      setLoading(false);
    }
  };

  // Show dialog to choose Camera or Library
  const handleRetakeChoice = () => {
    Alert.alert(
      'Chọn ảnh khác',
      'Bạn muốn chụp ảnh mới hay chọn từ thư viện?',
      [
        { text: 'Chụp ảnh', onPress: handleTakePhoto },
        { text: 'Chọn từ thư viện', onPress: handleSelectPhoto },
        { text: 'Hủy', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  // Action when user confirms the image
  const handleConfirmImage = () => {
    Alert.alert(
      'Thành công',
      'Đã sử dụng hình ảnh hóa đơn này để phân tích chi tiêu!',
      [
        {
          text: 'Đóng',
          onPress: () => {
            // Navigate back to Dashboard
            navigation.navigate('Dashboard');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backButton,
            {
              backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f2f2f7',
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.onBackground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.onBackground }]}>Xem trước ảnh</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.content, { padding: spacing.lg }]}>
        <View style={[styles.imageContainer, { borderColor: colors.outline }]}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <Image
              source={{ uri: currentUri }}
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </View>

        <View style={[styles.actionsContainer, { gap: spacing.md }]}>
          <Pressable
            onPress={handleConfirmImage}
            disabled={loading}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: colors.primary,
                opacity: pressed || loading ? 0.85 : 1,
              },
            ]}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.onPrimary} style={styles.btnIcon} />
            <Text style={[styles.primaryButtonText, { color: colors.onPrimary }]}>
              Dùng ảnh này
            </Text>
          </Pressable>

          <Pressable
            onPress={handleRetakeChoice}
            disabled={loading}
            style={({ pressed }) => [
              styles.secondaryButton,
              {
                borderColor: colors.primary,
                opacity: pressed || loading ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons name="camera-reverse-outline" size={20} color={colors.primary} style={styles.btnIcon} />
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
              Chụp / Chọn lại
            </Text>
          </Pressable>
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
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: hp(4),
  },
  imageContainer: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 20,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: hp(3),
    backgroundColor: '#0000000a',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  actionsContainer: {
    width: '100%',
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 52,
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  btnIcon: {
    marginRight: 8,
  },
});
