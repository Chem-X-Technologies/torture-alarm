import * as z from 'zod';
import { settingsFormSchema } from '~/components/screens/settings/SettingsForm';

type TortureAlarmConfig = z.infer<typeof settingsFormSchema>;

export default TortureAlarmConfig;