import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormInputNumber } from '~/components/ui/form';
import { useState } from 'react';
import { toast } from 'sonner-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import TortureAlarmConfig from '~/lib/types/tortureAlarmConfig';
import settingsService from '~/lib/services/settingsService';
import { View } from 'react-native';

export default function SettingsForm({
  defaultAlarmConfig,
}: {
  defaultAlarmConfig: TortureAlarmConfig;
}) {
  const form = useForm<TortureAlarmConfig>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: defaultAlarmConfig,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: TortureAlarmConfig) => {
    setLoading(true);

    settingsService
      .saveAlarmConfig(values)
      .then(() => toast.success('Settings saved successfully!'))
      .catch(() => toast.error('Failed to save settings!'))
      .finally(() => setLoading(false));
  };

  return (
    <Form {...form}>
      <View className="gap-7">
        <FormField
          control={form.control}
          name="firstAlarmMin"
          render={({ field }) => (
            <FormInputNumber
              label="First Alarm Min Interval *"
              placeholder="0"
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="firstAlarmMax"
          render={({ field }) => (
            <FormInputNumber
              label="First Alarm Max Interval *"
              placeholder="0"
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="lastAlarmMin"
          render={({ field }) => (
            <FormInputNumber
              label="Last Alarm Min Interval *"
              placeholder="0"
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="lastAlarmMax"
          render={({ field }) => (
            <FormInputNumber
              label="Last Alarm Max Interval *"
              placeholder="0"
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="intervalMin"
          render={({ field }) => (
            <FormInputNumber
              label="Min Interval *"
              placeholder="0"
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="intervalMax"
          render={({ field }) => (
            <FormInputNumber
              label="Max Interval *"
              placeholder="0"
              {...field}
            />
          )}
        />
        <Button onPress={form.handleSubmit(handleSubmit)} loading={loading}>
          <Text>Submit</Text>
        </Button>
      </View>
    </Form>
  );
}

export const settingsFormSchema = z.object({
  firstAlarmMin: z.number().min(1, {
    message: 'Please enter the first alarm minimum interval',
  }),
  firstAlarmMax: z.number().min(1, {
    message: 'Please enter the first alarm maximum interval',
  }),
  lastAlarmMin: z.number().min(1, {
    message: 'Please enter the last alarm minimum interval',
  }),
  lastAlarmMax: z.number().min(1, {
    message: 'Please enter the last alarm maximum interval',
  }),
  intervalMin: z.number().min(1, {
    message: 'Please enter the minimum interval',
  }),
  intervalMax: z.number().min(1, {
    message: 'Please enter the maximum interval',
  }),
});
