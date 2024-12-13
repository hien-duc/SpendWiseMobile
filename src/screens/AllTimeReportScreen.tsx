import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

interface Props {
}

const AllTimeReportScreen: React.FC<Props> = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All Time Report</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Lifetime Summary</Text>
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Total Income</Text>
                            <Text style={[styles.summaryValue, styles.incomeText]}>$150,000</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Total Expenses</Text>
                            <Text style={[styles.summaryValue, styles.expenseText]}>$120,000</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Net Worth</Text>
                            <Text style={[styles.summaryValue, styles.savingsText]}>$30,000</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Yearly Trends</Text>
                    {/* Add your yearly trends chart here */}
                    <Text style={styles.placeholderText}>Yearly trends visualization will be shown here</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Key Statistics</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Average Monthly Income</Text>
                            <Text style={styles.statValue}>$5,000</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Average Monthly Expenses</Text>
                            <Text style={styles.statValue}>$4,000</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Highest Income Month</Text>
                            <Text style={styles.statValue}>$8,000</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Highest Expense Month</Text>
                            <Text style={styles.statValue}>$6,000</Text>
                        </View>
                    </View>
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
    summaryCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    incomeText: {
        color: '#4CAF50',
    },
    expenseText: {
        color: '#F44336',
    },
    savingsText: {
        color: '#2196F3',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statItem: {
        width: '48%',
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    placeholderText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 20,
    },
});

export default AllTimeReportScreen;
