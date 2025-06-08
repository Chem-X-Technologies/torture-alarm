import TortureAlarmConfig from "../types/tortureAlarmConfig";
import storageService from "./storageService";

const defaultAlarmConfig: TortureAlarmConfig = {
  firstAlarmMin: 24,
  firstAlarmMax: 33,
  lastAlarmMin: 1,
  lastAlarmMax: 10,
  intervalMin: 24,
  intervalMax: 33,
};

const getAlarmConfig = async (): Promise<TortureAlarmConfig> => {
  try {
    const [
      firstAlarmMin,
      firstAlarmMax,
      lastAlarmMin,
      lastAlarmMax,
      intervalMin,
      intervalMax,
    ] = await Promise.all([
      storageService.getData('first_alarm_min'),
      storageService.getData('first_alarm_max'),
      storageService.getData('last_alarm_min'),
      storageService.getData('last_alarm_max'),
      storageService.getData('interval_min'),
      storageService.getData('interval_max'),
    ]);

    return {
      firstAlarmMin: firstAlarmMin ? parseInt(firstAlarmMin, 10) : defaultAlarmConfig.firstAlarmMin,
      firstAlarmMax: firstAlarmMax ? parseInt(firstAlarmMax, 10) : defaultAlarmConfig.firstAlarmMax,
      lastAlarmMin: lastAlarmMin ? parseInt(lastAlarmMin, 10) : defaultAlarmConfig.lastAlarmMin,
      lastAlarmMax: lastAlarmMax ? parseInt(lastAlarmMax, 10) : defaultAlarmConfig.lastAlarmMax,
      intervalMin: intervalMin ? parseInt(intervalMin, 10) : defaultAlarmConfig.intervalMin,
      intervalMax: intervalMax ? parseInt(intervalMax, 10) : defaultAlarmConfig.intervalMax,
    };
  } catch (error) {
    console.error('Failed to fetch alarm configuration:', error);
    throw error;
  }
}

const saveAlarmConfig = async (config: TortureAlarmConfig) => {
  try {
    await Promise.all([
      storageService.storeData('first_alarm_min', config.firstAlarmMin.toString()),
      storageService.storeData('first_alarm_max', config.firstAlarmMax.toString()),
      storageService.storeData('last_alarm_min', config.lastAlarmMin.toString()),
      storageService.storeData('last_alarm_max', config.lastAlarmMax.toString()),
      storageService.storeData('interval_min', config.intervalMin.toString()),
      storageService.storeData('interval_max', config.intervalMax.toString()),
    ]);
  } catch (error) {
    console.error('Failed to save alarm configuration:', error);
    throw error;
  }
}

const settingsService = {
  getAlarmConfig,
  saveAlarmConfig,
}

export default settingsService;