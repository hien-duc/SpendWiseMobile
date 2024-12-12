import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Props {
    onBack?: () => void;
}

const CategoryAnnualReportScreen: React.FC<Props> = ({ onBack }) => {
    const renderCategoryItem = (icon: string, name: string, amount: string, percentage: string) => (
        <View style={styles.categoryItem}>
            <View style={styles.categoryLeft}>
                <MaterialIcons name={icon} size={24} color="#666" />
                <Text style={styles.categoryName}>{name}</Text>
            </View>
            <View style={styles.categoryRight}>
                <Text style={styles.categoryAmount}>{amount}</Text>
                <Text style={styles.categoryPercentage}>{percentage}</Text>
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
                <Text style={styles.headerTitle}>Category Annual Report</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Expense Categories (2024)</Text>
                    {/* Add your pie chart here */}
                    <Text style={styles.placeholderText}>Category distribution chart will be shown here</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Category Breakdown</Text>
                    {renderCategoryItem('home', 'Housing', '$12,000', '30%')}
                    {renderCategoryItem('fastfood', 'Food', '$8,000', '20%')}
                    {renderCategoryItem('directions-car', 'Transportation', '$6,000', '15%')}
                    {renderCategoryItem('shopping-bag', 'Shopping', '$4,000', '10%')}
                    {renderCategoryItem('medical-services', 'Healthcare', '$4,000', '10%')}
                    {renderCategoryItem('more-horiz', 'Others', '$6,000', '15%')}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Monthly Trends</Text>
                    {/* Add your monthly trends chart here */}
                    <Text style={styles.placeholderText}>Monthly category trends will be shown here</Text>
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
    placeholderText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 20,
    },
});

export default CategoryAnnualReportScreen;
