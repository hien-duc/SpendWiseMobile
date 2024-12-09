import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/HomeScreen';
import ReportScreen from '../screens/ReportScreen';
import OtherScreen from '../screens/OtherScreen';
import SettingScreen from '../screens/SettingScreen';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
    <TouchableOpacity
        style={{
            top: -30,
            justifyContent: 'center',
            alignItems: 'center',
        }}
        onPress={onPress}
    >
        <View style={styles.plusButton}>
            {children}
        </View>
    </TouchableOpacity>
);

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: true,
                tabBarStyle: {
                    position: 'absolute',
                    height: 60,
                    backgroundColor: '#000000',
                },
                tabBarActiveTintColor: '#6C5CE7',
                tabBarInactiveTintColor: '#999999',
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="home" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Report"
                component={ReportScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="chart-bar" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Add"
                component={View}
                options={{
                    tabBarIcon: () => (
                        <MaterialCommunityIcons name="plus" color="#FFFFFF" size={30} />
                    ),
                    tabBarButton: (props) => (
                        <CustomTabBarButton {...props} onPress={() => {
                            // Handle plus button press
                            console.log('Plus button pressed');
                        }} />
                    ),
                }}
            />
            <Tab.Screen
                name="Other"
                component={OtherScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="dots-horizontal" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Setting"
                component={SettingScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="cog" color={color} size={26} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    plusButton: {
        width: 60,
        height: 60,
        backgroundColor: '#6C5CE7',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#6C5CE7',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});

export default TabNavigator;