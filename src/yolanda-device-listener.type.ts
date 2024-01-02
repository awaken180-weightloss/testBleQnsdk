export enum IYolandaConnectionState {
  QNScaleStateDisconnected = 0,
  QNScaleStateLinkLoss = -1,
  QNScaleStateConnected = 1,
  QNScaleStateConnecting = 2,
  QNScaleStateDisconnecting = 3,
  QNScaleStateStartMeasure = 4,
  QNScaleStateRealTime = 5,
  QNScaleStateBodyFat = 7,
  QNScaleStateHeartRate = 8,
  QNScaleStateMeasureCompleted = 9,
  QNScaleStateWiFiBleStartNetwork = 10,
  QNScaleStateWiFiBleNetworkSuccess = 11,
  QNScaleStateWiFiBleNetworkFail = 12,
  QNScaleStateBleKitchenPeeled = 13,
  QNScaleStateHeightScaleMeasureFail = 14,
}

export enum IScaleStateEnum {
  MEASURING = 'measuring',
  COMPLETE = 'complete',
  ERROR = 'error',
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  DISCONNECTED = 'disconnected',
}
