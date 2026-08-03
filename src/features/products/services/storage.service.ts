import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  static async setItem<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  static async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  static async clear(): Promise<void> {
    await AsyncStorage.clear();
  }
}
