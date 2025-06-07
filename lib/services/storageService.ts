import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key: string, value: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('Error storing data:', e);
  }
}

const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.error('Error retrieving data:', e);
    return null;
  }
};

const storageService = {
  storeData,
  getData,
};

export default storageService;

