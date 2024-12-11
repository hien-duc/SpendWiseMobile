import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="Auth" 
          component={AuthNavigator}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="MainTabs" 
          component={TabNavigator}
          options={{
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;