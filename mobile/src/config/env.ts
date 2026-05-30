import Constants from 'expo-constants';

type AppExtra = {
  apiBaseUrl?: string;
  appEnv?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as AppExtra;

export const env = {
  apiBaseUrl: extra.apiBaseUrl ?? 'https://api.example.com',
  appEnv: extra.appEnv ?? 'development',
  isDev: (extra.appEnv ?? 'development') === 'development',
} as const;
