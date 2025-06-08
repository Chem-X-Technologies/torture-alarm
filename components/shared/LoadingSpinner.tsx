import { ActivityIndicator, View } from 'react-native';

export default function LoadingSpinner() {
  return (
    <View className="items-center justify-center absolute top-0 left-0 right-0 bottom-0 z-10 bg-secondary">
      <ActivityIndicator size="large" className="text-foreground" />
    </View>
  );
}
