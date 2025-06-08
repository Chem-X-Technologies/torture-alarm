import { Link, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ImageBackground } from 'react-native';
import { toast } from 'sonner-native';
import SettingsForm from '~/components/screens/settings/SettingsForm';
import LoadingSpinner from '~/components/shared/LoadingSpinner';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import ChevronLeft from '~/lib/icons/ChevronLeft';
import settingsService from '~/lib/services/settingsService';
import TortureAlarmConfig from '~/lib/types/tortureAlarmConfig';

export default function SettingsScreen() {
  const [alarmConfig, setAlarmConfig] = useState({
    firstAlarmMin: 0,
    firstAlarmMax: 0,
    lastAlarmMin: 0,
    lastAlarmMax: 0,
    intervalMin: 0,
    intervalMax: 0,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      settingsService
        .getAlarmConfig()
        .then((config: TortureAlarmConfig) => {
          setAlarmConfig(config);
        })
        .catch((error) => {
          console.error('Failed to fetch alarm configuration:', error);
          toast.error('Failed to load alarm configuration.');
        })
        .finally(() => setLoading(false));
    }, [])
  );

  const handleBackPress = () => {
    router.back();
  };

  return (
    <ImageBackground
      className="flex-1 justify-center items-center p-6"
      source={require('~/assets/images/yoshiniku.png')}
      resizeMode="repeat"
    >
      <Card className="w-full max-w-sm rounded-2xl pt-6 bg-card/80 relative">
        <Button
          size="icon"
          className="bg-transparent h-[30px] w-[30px] absolute top-2 left-2"
          onPress={handleBackPress}
        >
          <ChevronLeft size={20} fill="white" />
        </Button>
        <CardHeader className="items-center">
          <CardTitle className="pb-2 text-center font-bold">
            Alarm Config
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <SettingsForm defaultAlarmConfig={alarmConfig} />
          )}
        </CardContent>
      </Card>
    </ImageBackground>
  );
}
