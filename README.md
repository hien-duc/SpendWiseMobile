# SpendWise Mobile App

A comprehensive mobile application for managing personal finances and tracking expenses.

## Release Information

### Available APK Variants

The app is available in four different APK variants optimized for different device architectures:

1. `arm64-v8a` - For modern 64-bit ARM devices (Most modern Android phones)
2. `armeabi-v7a` - For older 32-bit ARM devices
3. `x86_64` - For 64-bit x86 devices (Some tablets and emulators)
4. `x86` - For 32-bit x86 devices (Older tablets and emulators)

### Installation Instructions

1. Download the appropriate APK for your device architecture
2. Enable "Install from Unknown Sources" in your device settings
3. Open the downloaded APK file to install

### Which APK should I download?

- Most modern Android phones (2015 and newer) should use the `arm64-v8a` version
- Older Android phones should use the `armeabi-v7a` version
- If you're using an x86-based Android device or emulator, use the corresponding x86 version

### Version Information

Current Version: 1.0
Release Date: 2024-12-20

### Changelog

#### Version 1.0
- Initial release
- Personal finance management features
- Expense tracking
- Financial goals setting
- Budget management

## Development Setup

https://gamma.app/docs/SpendWiseMobile-A-Comprehensive-Mobile-Financial-Management-Solut-95ynke0k9dieyi4



This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to leaSpendWise Mobile v1.0 - Initial Releasern more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
