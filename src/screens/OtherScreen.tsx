import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AnnualReportScreen from './AnnualReportScreen';
import CategoryAnnualReportScreen from './CategoryAnnualReportScreen';
import AllTimeReportScreen from './AllTimeReportScreen';
import AllTimeCategoryReportScreen from './AllTimeCategoryReportScreen';
import FinancialGoalsScreen from './FinancialGoalsScreen';

const OtherScreen = () => {
    const [currentScreen, setCurrentScreen] = useState('main');

    const handleBack = () => {
        setCurrentScreen('main');
    };

    const renderItem = (icon: string, title: string, screenName: string) => (
        <TouchableOpacity 
            style={styles.item}
            onPress={() => setCurrentScreen(screenName)}
        >
            <View style={styles.itemLeft}>
                <MaterialIcons name={icon} size={24} color="#666" />
                <Text style={styles.itemText}>{title}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
    );

    // Render the appropriate screen based on currentScreen state
    const renderScreen = () => {
        const renderSubScreen = (Screen: React.ComponentType<any>) => (
            <GestureHandlerRootView style={styles.gestureContainer}>
                <Screen onBack={handleBack} />
            </GestureHandlerRootView>
        );

        switch (currentScreen) {
            case 'annual':
                return renderSubScreen(AnnualReportScreen);
            case 'categoryAnnual':
                return renderSubScreen(CategoryAnnualReportScreen);
            case 'allTime':
                return renderSubScreen(AllTimeReportScreen);
            case 'allTimeCategory':
                return renderSubScreen(AllTimeCategoryReportScreen);
            case 'goals':
                return renderSubScreen(FinancialGoalsScreen);
            default:
                return (
                    <View style={styles.container}>
                        <ScrollView style={styles.content}>
                            <View style={styles.section}>
                                {renderItem('bar-chart', 'Annual report', 'annual')}
                                {renderItem('pie-chart', 'Category annual report', 'categoryAnnual')}
                                {renderItem('timeline', 'All time report', 'allTime')}
                                {renderItem('donut-large', 'All time category report', 'allTimeCategory')}
                                {renderItem('flag', 'Financial Goals', 'goals')}
                            </View>
                        </ScrollView>
                    </View>
                );
        }
    };

    return renderScreen();
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    gestureContainer: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    section: {
        marginTop: 16,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 16,
    },
});

export default OtherScreen;