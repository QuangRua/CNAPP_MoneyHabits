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

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const colorScheme = useThemeStore((s) => s.colorScheme);
  const { colors, spacing } = colorScheme === 'dark' ? darkTheme : lightTheme;

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  // Validation errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);

  // Email format regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateFields = (
    cName: string,
    cEmail: string,
    cPassword: string,
    cConfirmPassword: string,
    showErrors: boolean
  ) => {
    let isNameOk = true;
    let isEmailOk = true;
    let isPasswordOk = true;
    let isConfirmOk = true;

    // Validate Name
    if (!cName.trim()) {
      if (showErrors) setNameError('Họ và tên không được để trống');
      isNameOk = false;
    } else {
      setNameError('');
    }

    // Validate Email
    if (!cEmail.trim()) {
      if (showErrors) setEmailError('Email không được để trống');
      isEmailOk = false;
    } else if (!emailRegex.test(cEmail.trim())) {
      if (showErrors) setEmailError('Email không đúng định dạng (VD: example@mail.com)');
      isEmailOk = false;
    } else {
      setEmailError('');
    }

    // Validate Password
    if (!cPassword) {
      if (showErrors) setPasswordError('Mật khẩu không được để trống');
      isPasswordOk = false;
    } else if (cPassword.length < 6) {
      if (showErrors) setPasswordError('Mật khẩu phải chứa ít nhất 6 ký tự');
      isPasswordOk = false;
    } else {
      setPasswordError('');
    }

    // Validate Confirm Password
    if (!cConfirmPassword) {
      if (showErrors) setConfirmPasswordError('Vui lòng xác nhận lại mật khẩu');
      isConfirmOk = false;
    } else if (cConfirmPassword !== cPassword) {
      if (showErrors) setConfirmPasswordError('Mật khẩu xác nhận không trùng khớp');
      isConfirmOk = false;
    } else {
      setConfirmPasswordError('');
    }

    setIsFormValid(isNameOk && isEmailOk && isPasswordOk && isConfirmOk);
  };

  // Run validation on inputs change
  useEffect(() => {
    validateFields(name, email, password, confirmPassword, hasSubmittedOnce);
  }, [name, email, password, confirmPassword, hasSubmittedOnce]);

  const handleRegister = () => {
    setHasSubmittedOnce(true);
    validateFields(name, email, password, confirmPassword, true);

    if (
      name.trim() &&
      emailRegex.test(email.trim()) &&
      password.length >= 6 &&
      password === confirmPassword
    ) {
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

            {/* Header Text */}
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: colors.onBackground }]}>Đăng ký tài khoản</Text>
              <Text style={[styles.subtitle, { color: colors.outline }]}>
                Tham gia MoneyHabits để quản lý ví của bạn tốt hơn
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.onBackground }]}>Họ và tên</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      borderColor: nameError ? '#ff4d4f' : colors.outline,
                      backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f9f9fb',
                    },
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={nameError ? '#ff4d4f' : colors.outline}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.onBackground }]}
                    placeholder="Nhập họ và tên của bạn..."
                    placeholderTextColor={colors.outline}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
                {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
              </View>

              {/* Email */}
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

              {/* Password */}
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
                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)..."
                    placeholderTextColor={colors.outline}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={securePassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable
                    onPress={() => setSecurePassword(!securePassword)}
                    style={styles.eyeBtn}
                  >
                    <Ionicons
                      name={securePassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.outline}
                    />
                  </Pressable>
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.onBackground }]}>Xác nhận mật khẩu</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      borderColor: confirmPasswordError ? '#ff4d4f' : colors.outline,
                      backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f9f9fb',
                    },
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={confirmPasswordError ? '#ff4d4f' : colors.outline}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.onBackground }]}
                    placeholder="Nhập lại mật khẩu..."
                    placeholderTextColor={colors.outline}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={secureConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable
                    onPress={() => setSecureConfirmPassword(!secureConfirmPassword)}
                    style={styles.eyeBtn}
                  >
                    <Ionicons
                      name={secureConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.outline}
                    />
                  </Pressable>
                </View>
                {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
              </View>

              {/* Submit Button */}
              <Pressable
                onPress={handleRegister}
                style={({ pressed }) => [
                  styles.submitBtn,
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.9 : 1,
                    marginTop: spacing.md,
                  },
                ]}
              >
                <Text style={[styles.submitBtnText, { color: colors.onPrimary }]}>Đăng ký</Text>
              </Pressable>
            </View>

            {/* Switch to Login footer */}
            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: colors.outline }]}>
                Đã có tài khoản?{' '}
              </Text>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.footerLinkText, { color: colors.primary }]}>Đăng nhập</Text>
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
    marginTop: 10,
    marginBottom: 24,
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
    marginBottom: 16,
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
