import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { reportsService } from '../api/reportsService';
import { format } from 'date-fns';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useAuth } from '../context/AuthContext';
import MonthYearPicker from '../components/MonthYearPicker';

const { width } = Dimensions.get('window');

interface CategoryTotal {
    category: string;
    amount: number;
    color: string;
    icon: string;
    percentage: number;
    type: 'expense' | 'income' | 'investment';
}

const ReportScreen = () => {
    const navigation = useNavigation();
    const { isAuthenticated, logout } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [expenseTotal, setExpenseTotal] = useState(0);
    const [incomeTotal, setIncomeTotal] = useState(0);
    const [investmentTotal, setInvestmentTotal] = useState(0);
    const [netBalance, setNetBalance] = useState(0);
    const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'expense' | 'income' | 'investment'>('expense');

    const fetchReportData = async () => {
        try {
            if (!isAuthenticated) {
                navigation.navigate('Login');
                return;
            }

            setLoading(true);
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();

            const reportData = await reportsService.getMonthlyReport(month, year);

            if (reportData && reportData.length > 0) {
                // Set totals from the first row
                setExpenseTotal(reportData[0].total_expense || 0);
                setIncomeTotal(reportData[0].total_income || 0);
                setInvestmentTotal(reportData[0].total_investment || 0);
                setNetBalance(reportData[0].net_balance || 0);

                // Transform category data
                const transformedCategories = reportData.map(item => ({
                    category: item.category_name,
                    amount: item.category_amount,
                    color: item.category_color,
                    icon: item.category_icon,
                    percentage: item.category_percentage,
                    type: item.category_type
                }));

                setCategoryTotals(transformedCategories);
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
            if (error.response?.status === 401) {
                Alert.alert(
                    'Session Expired',
                    'Your session has expired. Please log in again.',
                    [{
                        text: 'OK',
                        onPress: async () => {
                            await logout();
                            navigation.navigate('Login');
                        }
                    }]
                );
            } else {
                Alert.alert('Error', 'Unable to fetch report data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [currentDate, isAuthenticated]);

    const handleDateChange = (newDate: Date) => {
        setCurrentDate(newDate);
    };

    const handleCategoryPress = (category: CategoryTotal) => {
        navigation.navigate('CategoryDetail', {
            category: category.category,
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear()
        });
    };

    const filteredCategories = categoryTotals.filter(cat => cat.type === activeTab);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <MonthYearPicker
                selectedDate={currentDate}
                onDateChange={handleDateChange}
            />

            <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Expense</Text>
                        <Text style={[styles.summaryAmount, styles.expenseText]}>
                            -{expenseTotal.toLocaleString()}$
                        </Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Income</Text>
                        <Text style={[styles.summaryAmount, styles.incomeText]}>
                            +{incomeTotal.toLocaleString()}$
                        </Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Investment</Text>
                        <Text style={[styles.summaryAmount, styles.investmentText]}>
                            {investmentTotal.toLocaleString()}$
                        </Text>
                    </View>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Net Balance</Text>
                    <Text style={[styles.totalAmount, netBalance >= 0 ? styles.incomeText : styles.expenseText]}>
                        {netBalance >= 0 ? '+' : ''}{netBalance.toLocaleString()}$
                    </Text>
                </View>
            </View>

            <View style={styles.tabContainer}>
                {['expense', 'income', 'investment'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tab,
                            activeTab === tab && styles.activeTab
                        ]}
                        onPress={() => setActiveTab(tab as 'expense' | 'income' | 'investment')}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === tab && styles.activeTabText
                        ]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {filteredCategories.length > 0 ? (
                <>
                    <View style={styles.chartContainer}>
                        <PieChart
                            data={filteredCategories.map(cat => ({
                                name: cat.category,
                                amount: cat.amount,
                                color: cat.color,
                                legendFontColor: '#7F7F7F',
                                legendFontSize: 12
                            }))}
                            width={width - 32}
                            height={220}
                            chartConfig={{
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor="amount"
                            backgroundColor="transparent"
                            paddingLeft="15"
                        />
                    </View>

                    <View style={styles.categoryList}>
                        {filteredCategories.map((category, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.categoryItem}
                                onPress={() => handleCategoryPress(category)}
                            >
                                <View style={styles.categoryInfo}>
                                    <MaterialIcons
                                        name={category.icon}
                                        size={24}
                                        color={category.color}
                                    />
                                    <Text style={styles.categoryName}>{category.category}</Text>
                                </View>
                                <View style={styles.categoryAmount}>
                                    <Text style={styles.amountText}>
                                        {category.amount.toLocaleString()}$
                                    </Text>
                                    <Text style={styles.percentageText}>
                                        {category.percentage.toFixed(1)}%
                                    </Text>
                                    <MaterialIcons name="chevron-right" size={24} color="#666" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No {activeTab} categories for this period</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryCard: {
        margin: 16,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    summaryItem: {
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    summaryAmount: {
        fontSize: 16,
        fontWeight: '600',
    },
    expenseText: {
        color: '#FF5252',
    },
    incomeText: {
        color: '#4CAF50',
    },
    investmentText: {
        color: '#2196F3',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    totalLabel: {
        fontSize: 14,
        color: '#666',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeTab: {
        backgroundColor: '#FF5722',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: '600',
    },
    chartContainer: {
        marginVertical: 16,
        alignItems: 'center',
    },
    categoryList: {
        paddingHorizontal: 16,
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryName: {
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
    },
    categoryAmount: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amountText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginRight: 8,
    },
    percentageText: {
        fontSize: 14,
        color: '#666',
        marginRight: 8,
    },
    emptyState: {
        padding: 32,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
    },
});

export default ReportScreen;