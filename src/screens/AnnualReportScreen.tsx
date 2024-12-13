import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { otherService } from '../api/otherService';
import YearPicker from '../components/YearPicker';

const AnnualReportScreen = () => {
    const navigation = useNavigation();
    const { session } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reportData, setReportData] = useState<any[]>([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        if (session) {
            fetchAnnualReport();
        }
    }, [session, selectedYear]);

    const fetchAnnualReport = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await otherService.getAnnualTransactionsReport(selectedYear, session);
            setReportData(data);
        } catch (err) {
            setError('Failed to load report data');
            console.error('Error fetching annual report:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Annual Report {selectedYear}</Text>
                    <View style={styles.placeholder} />
                </View>
                <YearPicker selectedYear={selectedYear} onYearChange={setSelectedYear} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2196F3" />
                </View>
            </View>
        );
    }

    const latestData = reportData[reportData.length - 1] || {};

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Annual Report {selectedYear}</Text>
                <View style={styles.placeholder} />
            </View>
            <YearPicker selectedYear={selectedYear} onYearChange={setSelectedYear} />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <View style={styles.errorContainer}>
                    <MaterialIcons name="error-outline" size={48} color="#F44336" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchAnnualReport}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView style={styles.content}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Year to Date Summary</Text>
                        <View style={styles.summaryCard}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Total Income</Text>
                                <Text style={[styles.summaryValue, styles.incomeText]}>
                                    {formatCurrency(latestData.year_to_date_income_total || 0)}
                                </Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Total Expenses</Text>
                                <Text style={[styles.summaryValue, styles.expenseText]}>
                                    {formatCurrency(latestData.year_to_date_expense_total || 0)}
                                </Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Total Investment</Text>
                                <Text style={[styles.summaryValue, styles.investmentText]}>
                                    {formatCurrency(latestData.year_to_date_investment_total || 0)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Monthly Breakdown</Text>
                        {reportData.map((month, index) => (
                            <View key={month.month_number} style={styles.monthCard}>
                                <Text style={styles.monthTitle}>{month.month_name}</Text>
                                <View style={styles.monthDetails}>
                                    <View style={styles.detailItem}>
                                        <MaterialIcons name="arrow-upward" size={20} color="#4CAF50" />
                                        <Text style={styles.detailLabel}>Income</Text>
                                        <Text style={[styles.detailValue, styles.incomeText]}>
                                            {formatCurrency(month.income_amount)}
                                        </Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <MaterialIcons name="arrow-downward" size={20} color="#F44336" />
                                        <Text style={styles.detailLabel}>Expenses</Text>
                                        <Text style={[styles.detailValue, styles.expenseText]}>
                                            {formatCurrency(month.expense_amount)}
                                        </Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <MaterialIcons name="trending-up" size={20} color="#2196F3" />
                                        <Text style={styles.detailLabel}>Investment</Text>
                                        <Text style={[styles.detailValue, styles.investmentText]}>
                                            {formatCurrency(month.investment_amount)}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.runningTotalContainer}>
                                    <Text style={styles.runningTotalLabel}>Running Totals:</Text>
                                    <Text style={styles.runningTotalText}>
                                        Income: {formatCurrency(month.running_income_total)}
                                    </Text>
                                    <Text style={styles.runningTotalText}>
                                        Expenses: {formatCurrency(month.running_expense_total)}
                                    </Text>
                                    <Text style={styles.runningTotalText}>
                                        Investment: {formatCurrency(month.running_investment_total)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#F44336',
        marginTop: 10,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 5,
    },
    retryButtonText: {
        color: '#FFF',
        fontSize: 16,
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
    monthCard: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    monthTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    monthDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailItem: {
        flex: 1,
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 12,
        color: '#666',
        marginVertical: 4,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    runningTotalContainer: {
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingTop: 12,
        marginTop: 8,
    },
    runningTotalLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    runningTotalText: {
        fontSize: 12,
        color: '#666',
        marginVertical: 2,
    },
    incomeText: {
        color: '#4CAF50',
    },
    expenseText: {
        color: '#F44336',
    },
    investmentText: {
        color: '#2196F3',
    },
});

export default AnnualReportScreen;
