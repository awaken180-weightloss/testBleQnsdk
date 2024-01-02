import {useCallback, useEffect, useState} from 'react';
import {NativeEventEmitter} from 'react-native';
import {
  BleQnsdk,
  FinalMeasurementResponse,
  YolandaDeviceInfo,
  YolandaEventEmitter,
  YolandaEventTypeEnum,
  buildYolandaUser,
  startYolandaScan,
} from 'react-native-ble-qnsdk';

import {
  IScaleStateEnum,
  IYolandaConnectionState,
} from './yolanda-device-listener.type';

const QNSDKEmitter = new NativeEventEmitter(BleQnsdk);

const useYolandaDeviceListener = () => {
  const [device, setDevice] = useState<YolandaDeviceInfo | null>(null);
  const [status, setStatus] = useState<IScaleStateEnum | null>(null);
  const [measurement, setMeasurement] =
    useState<FinalMeasurementResponse | null>(null);
  const [startScaleScan, setStartScaleScan] = useState(false);

  const onStopScaleScan = useCallback(() => {
    setStartScaleScan(false);
  }, []);

  const onStartScaleScan = useCallback(async () => {
    setStartScaleScan(true);

    // height in cms
    const heightUnit = Math.round((6 * 12 + 2) * 2.54);

    const userInfo = {
      birthday: '1990-01-01', // Date of birth (YYYY-MM-DD)
      gender: 'male', // "male" or "female"
      id: 'abc@test.com',
      height: heightUnit, // Height in cm
      unit: 1, // Measurement unit (1 for metric, 2 for imperial)
      athleteType: 1, // Athlete type (0 for general, 1 for athlete)
    };

    try {
      await buildYolandaUser(userInfo);
      await startYolandaScan();
    } catch (error) {
      console.log('onStartScaleScan error', error);

      onStopScaleScan();
    }
  }, [onStopScaleScan]);

  const filterStateChange = useCallback(
    (value: number): void => {
      switch (value) {
        case IYolandaConnectionState.QNScaleStateMeasureCompleted:
          return setStatus(IScaleStateEnum.COMPLETE);
        case IYolandaConnectionState.QNScaleStateDisconnected:
        case IYolandaConnectionState.QNScaleStateLinkLoss:
          return setStatus(IScaleStateEnum.DISCONNECTED);
        case IYolandaConnectionState.QNScaleStateConnecting:
          return setStatus(IScaleStateEnum.CONNECTING);
        case IYolandaConnectionState.QNScaleStateConnected:
        case IYolandaConnectionState.QNScaleStateRealTime:
          return setStatus(IScaleStateEnum.CONNECTED);
        case IYolandaConnectionState.QNScaleStateStartMeasure:
        case IYolandaConnectionState.QNScaleStateBodyFat:
          return setStatus(IScaleStateEnum.MEASURING);
      }
    },
    [setStatus],
  );

  const finalMeasurementResponse = useCallback(
    (value: FinalMeasurementResponse): void => {
      setMeasurement(value);
      onStopScaleScan();
    },
    [onStopScaleScan],
  );

  const notificationFilter = useCallback(
    async (response: YolandaEventEmitter) => {
      try {
        if (response.type === YolandaEventTypeEnum.SCALE_STATE_CHANGE) {
          filterStateChange(response.value);
        }
        if (response.type === YolandaEventTypeEnum.FINAL_MEASUREMENT_EVENT) {
          finalMeasurementResponse(response.value);
        }
        if (response.type === YolandaEventTypeEnum.DEVICE_INFO) {
          setDevice(response.value);
        }
      } catch (error) {
        console.log('notificationFilter error', error);
      }
    },
    [filterStateChange, finalMeasurementResponse],
  );

  const resetScale = useCallback(() => {
    setDevice(null);
    setStatus(null);
    setMeasurement(null);
  }, []);

  // Add listeners
  useEffect(() => {
    const progressSubscription = QNSDKEmitter.addListener(
      'uploadProgress',
      (response: YolandaEventEmitter) => {
        notificationFilter(response);
      },
    );

    return () => {
      progressSubscription?.remove();
    };
  }, [notificationFilter]);

  return {
    device,
    status,
    resetScale,
    measurement,
    startScaleScan,
    onStartScaleScan,
    onStopScaleScan,
  };
};

export default useYolandaDeviceListener;
