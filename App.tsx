/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import useYolandaDeviceListener from './src/yolanda-device-listener.hook';

export const initBluetooth = async () => {
  try {
    await BleManager.start({showAlert: false});
    console.info('[initBluetooth] BleManager start OK');
  } catch (error) {
    throw new Error('BleManager start failed.');
  }
};

export const handleAndroidBluetoothPermissions = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 31) {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      console.info(
        '[handleAndroidPermissions] User accepts runtime permissions android 12+',
      );
    } catch (error) {
      console.error(
        '[handleAndroidPermissions] User refuses runtime permissions android 12+',
      );
    }
  } else if (Platform.OS === 'android' && Platform.Version >= 23) {
    try {
      const checkResult = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (checkResult) {
        console.info(
          '[handleAndroidPermissions] runtime permission Android <12 already OK',
        );
      } else {
        try {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );

          console.info(
            '[handleAndroidPermissions] User accepts runtime permission android <12',
          );
        } catch (error) {
          console.error(
            '[handleAndroidPermissions] User refuses runtime permission android <12',
          );
        }
      }
    } catch (error) {
      console.error(
        '[handleAndroidPermissions] User refuses runtime permission android <12',
      );
    }
  }
};

// Init bluetooth and add listeners
const handleBluetoothInit = async () => {
  try {
    await initBluetooth();
    await handleAndroidBluetoothPermissions();
  } catch (error) {
    console.info('[handleBluetoothInit] Error', error);
  }
};

function App(): React.JSX.Element {
  const {status, onStartScaleScan, measurement, device} =
    useYolandaDeviceListener();

  console.log('measurement', measurement);
  console.log('device', device);
  console.log('status', status);

  useEffect(() => {
    handleBluetoothInit();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <Button title="Start" onPress={onStartScaleScan} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
