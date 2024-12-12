import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface Props {
    onBack?: () => void;
}

const AnnualReportScreen: React.FC<Props> = ({ onBack }) => {
    const gesture = Gesture.Fling()
        .direction(Gesture.DIRECTION_RIGHT)
        .onEnd(() => {
            if (onBack) onBack();
        });

    return (
        <GestureDetector gesture={gesture}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={onBack}
                    >
                        <MaterialIcons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Annual Report</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView style={styles.content}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>2024 Summary</Text>
                        <View style={styles.summaryCard}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Total Income</Text>
                                <Text style={[styles.summaryValue, styles.incomeText]}>$25,000</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Total Expenses</Text>
                                <Text style={[styles.summaryValue, styles.expenseText]}>$18,500</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Net Savings</Text>
                                <Text style={[styles.summaryValue, styles.savingsText]}>$6,500</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Monthly Breakdown</Text>
                        {/* Add your monthly breakdown chart/data here */}
                        <Text style={styles.placeholderText}>Monthly data visualization will be shown here</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Top Categories</Text>
                        {/* Add your top categories list here */}
                        <Text style={styles.placeholderText}>Top spending categories will be shown here</Text>
                    </View>
                </ScrollView>
            </View>
        </GestureDetector>
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
    placeholderText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 20,
    },
});

export default AnnualReportScreen;
