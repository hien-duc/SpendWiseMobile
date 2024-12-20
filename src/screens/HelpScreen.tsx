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
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F4F8',
        backgroundColor: '#FFFFFF',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    backButton: {
        padding: 12,
        borderRadius: 40,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2E3A59',
        letterSpacing: 0.5,
    },
    placeholder: {
        width: 48,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    section: {
        marginBottom: 32,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#2E3A59',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    sectionContent: {
        fontSize: 16,
        color: '#8F9BB3',
        lineHeight: 24,
    },
});

export default HelpScreen;
