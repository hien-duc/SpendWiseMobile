import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import HelpScreen from './src/screens/HelpScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import AboutScreen from './src/screens/AboutScreen';

const App = () => {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.container}>
        <AppNavigator />
      </SafeAreaView>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default App;