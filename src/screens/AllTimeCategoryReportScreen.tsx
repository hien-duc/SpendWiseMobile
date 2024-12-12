import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Props {
    onBack?: () => void;
}

const AllTimeCategoryReportScreen: React.FC<Props> = ({ onBack }) => {
    const renderCategoryItem = (icon: string, name: string, amount: string, percentage: string, trend: string) => (
        <View style={styles.categoryItem}>
            <View style={styles.categoryLeft}>
                <MaterialIcons name={icon} size={24} color="#666" />
                <Text style={styles.categoryName}>{name}</Text>
            </View>
            <View style={styles.categoryRight}>
                <Text style={styles.categoryAmount}>{amount}</Text>
                <Text style={styles.categoryPercentage}>{percentage}</Text>
                <Text style={[styles.categoryTrend, { color: trend.includes('+') ? '#4CAF50' : '#F44336' }]}>
                    {trend}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={onBack}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All Time Category Report</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Overall Category Distribution</Text>
                    {/* Add your pie chart here */}
                    <Text style={styles.placeholderText}>Category distribution chart will be shown here</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Category Details</Text>
                    {renderCategoryItem('home', 'Housing', '$60,000', '35%', '+5%')}
                    {renderCategoryItem('fastfood', 'Food', '$30,000', '20%', '-2%')}
                    {renderCategoryItem('directions-car', 'Transportation', '$25,000', '15%', '+1%')}
                    {renderCategoryItem('shopping-bag', 'Shopping', '$20,000', '12%', '+3%')}
                    {renderCategoryItem('medical-services', 'Healthcare', '$15,000', '10%', '-1%')}
                    {renderCategoryItem('more-horiz', 'Others', '$10,000', '8%', '0%')}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Category Growth</Text>
                    {/* Add your growth chart here */}
                    <Text style={styles.placeholderText}>Category growth trends will be shown here</Text>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    categoryLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryName: {
        fontSize: 16,
        color: '#333',
        marginLeft: 12,
    },
    categoryRight: {
        alignItems: 'flex-end',
    },
    categoryAmount: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
    categoryPercentage: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    categoryTrend: {
        fontSize: 12,
        marginTop: 4,
    },
    placeholderText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 20,
    },
});

export default AllTimeCategoryReportScreen;
