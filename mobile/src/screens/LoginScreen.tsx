import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeStore } from '@/state_management/themeStore';
import { darkTheme, lightTheme } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const colorScheme = useThemeStore((s) => s.colorScheme);
  const { colors, spacing } = colorScheme === 'dark' ? darkTheme : lightTheme;

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);

  // Email format regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Real-time validation handler
  const validateFields = (currentEmail: string, currentPassword: string, showErrors: boolean) => {
    let isEmailOk = true;
    let isPasswordOk = true;

    // Validate email
    if (!currentEmail.trim()) {
      if (showErrors) setEmailError('Email không được để trống');
      isEmailOk = false;
    } else if (!emailRegex.test(currentEmail.trim())) {
      if (showErrors) setEmailError('Email không đúng định dạng (VD: example@mail.com)');
      isEmailOk = false;
    } else {
      setEmailError('');
    }

    // Validate password
    if (!currentPassword) {
      if (showErrors) setPasswordError('Mật khẩu không được để trống');
      isPasswordOk = false;
    } else if (currentPassword.length < 6) {
      if (showErrors) setPasswordError('Mật khẩu phải chứa ít nhất 6 ký tự');
      isPasswordOk = false;
    } else {
      setPasswordError('');
    }

    setIsFormValid(isEmailOk && isPasswordOk);
  };

  // Run validation on inputs change
  useEffect(() => {
    validateFields(email, password, hasSubmittedOnce);
  }, [email, password, hasSubmittedOnce]);

  const handleLogin = () => {
    setHasSubmittedOnce(true);
    validateFields(email, password, true);

    // If form is valid, navigate to Home
    if (emailRegex.test(email.trim()) && password.length >= 6) {
      Keyboard.dismiss();
      // Navigate to Home
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
            {/* Back Button */}
            <View style={styles.headerRow}>
              <Pressable
                onPress={() => navigation.goBack()}
                style={({ pressed }) => [
                  styles.backBtn,
                  {
                    backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f2f2f7',
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Ionicons name="arrow-back" size={20} color={colors.onBackground} />
              </Pressable>
            </View>

            {/* Title / Description */}
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: colors.onBackground }]}>Chào mừng trở lại!</Text>
              <Text style={[styles.subtitle, { color: colors.outline }]}>
                Đăng nhập để tiếp tục theo dõi chi tiêu của bạn
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.onBackground }]}>Địa chỉ Email</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      borderColor: emailError ? '#ff4d4f' : colors.outline,
                      backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f9f9fb',
                    },
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={emailError ? '#ff4d4f' : colors.outline}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.onBackground }]}
                    placeholder="Nhập email của bạn..."
                    placeholderTextColor={colors.outline}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.onBackground }]}>Mật khẩu</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      borderColor: passwordError ? '#ff4d4f' : colors.outline,
                      backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f9f9fb',
                    },
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={passwordError ? '#ff4d4f' : colors.outline}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.onBackground }]}
                    placeholder="Nhập mật khẩu..."
                    placeholderTextColor={colors.outline}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                    style={styles.eyeBtn}
                  >
                    <Ionicons
                      name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.outline}
                    />
                  </Pressable>
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              </View>

              {/* Forgot Password Link */}
              <Pressable style={styles.forgotPassword}>
                <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                  Quên mật khẩu?
                </Text>
              </Pressable>

              {/* Submit Button */}
              <Pressable
                onPress={handleLogin}
                style={({ pressed }) => [
                  styles.submitBtn,
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.9 : 1,
                    marginTop: spacing.md,
                  },
                ]}
              >
                <Text style={[styles.submitBtnText, { color: colors.onPrimary }]}>Đăng nhập</Text>
              </Pressable>
            </View>

            {/* Switch to Register footer */}
            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: colors.outline }]}>
                Chưa có tài khoản?{' '}
              </Text>
              <Pressable onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.footerLinkText, { color: colors.primary }]}>Đăng ký ngay</Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerRow: {
    height: 60,
    justifyContent: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    height: 54,
    borderWidth: 1.5,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  eyeBtn: {
    padding: 4,
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
    paddingLeft: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitBtn: {
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
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingVertical: 10,
  },
  footerText: {
    fontSize: 14,
  },
  footerLinkText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
