import { MMKV } from 'react-native-mmkv';

import resetUtils from '../utils/resetUtils';

import type { AsyncStorageStatic } from '@react-native-async-storage/async-storage';

export const appSetting = new MMKV({
  id: `onekey-app-setting`,
});

export enum EAppSettingKey {
  rrt = 'rrt',
  perf_switch = 'perf_switch',
}

export interface IAppStorage extends AsyncStorageStatic {
  setSetting: (key: EAppSettingKey, value: boolean | string | number) => void;
  getSettingString: (key: EAppSettingKey) => string | undefined;
  getSettingNumber: (key: EAppSettingKey) => number | undefined;
  getSettingBoolean: (key: EAppSettingKey) => boolean | undefined;
  deleteSetting: (key: EAppSettingKey) => void;
  clearSetting: typeof appSetting.clearAll;
  getAllKeysOfSetting: typeof appSetting.getAllKeys;
}

export const buildAppStorageFactory = (
  appStorage: AsyncStorageStatic,
): IAppStorage => {
  const storage = appStorage as IAppStorage;

  const originalSetItem = storage.setItem;

  const setItem: IAppStorage['setItem'] = (key, value, callback) => {
    resetUtils.checkNotInResetting();
    return originalSetItem(key, value, callback);
  };

  const removeItem: IAppStorage['removeItem'] = (key, callback) => {
    resetUtils.checkNotInResetting();
    return storage.removeItem(key, callback);
  };

  storage.setItem = setItem;
  storage.removeItem = removeItem;

  storage.setSetting = appSetting.set.bind(appSetting);
  storage.getSettingString = appSetting.getString.bind(appSetting);
  storage.getSettingNumber = appSetting.getNumber.bind(appSetting);
  storage.getSettingBoolean = appSetting.getBoolean.bind(appSetting);
  storage.deleteSetting = appSetting.delete.bind(appSetting);
  storage.clearSetting = appSetting.clearAll.bind(appSetting);
  storage.getAllKeysOfSetting = appSetting.getAllKeys.bind(appSetting);
  return storage;
};
