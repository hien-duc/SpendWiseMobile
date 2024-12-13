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
                <MaterialIcons name={icon} size={24} color="#666" />
                <Text style={styles.itemText}>{title}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
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
        backgroundColor: '#F5F5F5',
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