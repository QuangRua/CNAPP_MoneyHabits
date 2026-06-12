export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: { sessionMessage?: string } | undefined;
  Register: undefined;
  Dashboard: undefined;
  TransactionHistory: undefined;
  ImagePreview: { imageUri: string };
  Home: undefined;
};
