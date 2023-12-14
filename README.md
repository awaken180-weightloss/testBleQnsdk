# Test BLE QNSDK

This is a test app to test if the react-native-ble-qnsdk library works.

## Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

### Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

### Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

#### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

#### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

### Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Issues

- App works fine when we do not use the `react-native-ble-qnsdk` library. Try installing the Android app when you are in the main branch
- Switch to dev where the `react-native-ble-qnsdk` library is installed and try installing the Android app again. It will fail with the following error:

```bash
Error: Attribute application@allowBackup value=(false) from AndroidManifest.xml:24:7-34 is also present at [com.github.YolandaQingniu:qnscalesdkX:2.10.0] AndroidManifest.xml:19:9-35 value=(true). Suggestion: add 'tools:replace="android:allowBackup"' to <application> element at AndroidManifest.xml:5:5-8:50 to override.

```

To fix this error, we need to add the following line to the `AndroidManifest.xml` file:

```xml
<application
  ...
  tools:replace="android:allowBackup"
  ...
>
```

- After adding the above line, the app will install successfully but will crash when you open it.
