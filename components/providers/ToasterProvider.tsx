import { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';

export default function ToasterProvider({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        {children}
        <Toaster offset={100} />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
