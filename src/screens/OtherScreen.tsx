import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const OtherScreen = () => {
    const navigation = useNavigation();

    const renderItem = (icon: string, title: string, screenName: string) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate(screenName)}
        >
            <View style={styles.itemLeft}>
                <MaterialIcons name={icon} size={24} color="#4CAF50" />
                <Text style={styles.itemText}>{title}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    {renderItem('bar-chart', 'Annual report', 'AnnualReport')}
                    {renderItem('pie-chart', 'Category annual report', 'CategoryAnnualReport')}
                    {renderItem('timeline', 'All time report', 'AllTimeReport')}
                    {renderItem('donut-large', 'All time category report', 'AllTimeCategoryReport')}
                    {renderItem('flag', 'Financial Goals', 'FinancialGoals')}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingTop: 12,
    },
    section: {
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemText: {
        fontSize: 16,
        color: '#334155',
        marginLeft: 16,
        fontWeight: '500',
        letterSpacing: 0.2,
        flex: 1,
    },
});

export default OtherScreen;