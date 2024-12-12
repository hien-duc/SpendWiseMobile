import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const HelpScreen = () => {
    const navigation = useNavigation();

    const renderHelpSection = (title: string, content: string) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.sectionContent}>{content}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                {renderHelpSection(
                    'Getting Started',
                    'SpendWise helps you track your income, expenses, and investments. Start by setting your initial balance and adding your first transaction.'
                )}

                {renderHelpSection(
                    'Adding Transactions',
                    'Tap the + button to add a new transaction. Select the type (income, expense, or investment), enter the amount, and choose a category.'
                )}

                {renderHelpSection(
                    'Categories',
                    'SpendWise comes with preset categories for income, expenses, and investments. You can also create your own custom categories.'
                )}

                {renderHelpSection(
                    'Reports',
                    'View your financial reports by month or year. See breakdowns by category and track your spending patterns.'
                )}

                {renderHelpSection(
                    'Contact Support',
                    'Need more help? Email us at support@spendwise.com or visit our website at www.spendwise.com/support'
                )}
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
        marginBottom: 8,
    },
    sectionContent: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});

export default HelpScreen;
