import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import CategoryManagementScreen from '../screens/CategoryManagementScreen';
import CreateCategoryScreen from '../screens/CreateCategoryScreen';

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
        <Stack.Screen 
          name="CategoryManagement" 
          component={CategoryManagementScreen}
          options={{ headerShown: false }}
          initialParams={{ initialType: undefined }}
        />
        <Stack.Screen 
          name="CreateCategory" 
          component={CreateCategoryScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;