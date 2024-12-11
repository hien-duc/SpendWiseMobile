import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { reportsService } from '../api/reportsService';
import { format } from 'date-fns';
import { Dimensions } from 'react-native';
import { useAuth } from '../context/AuthContext';
import MonthYearPicker from '../components/MonthYearPicker';
import { PieChart } from 'react-native-svg-charts';
import { Text as SVGText } from 'react-native-svg';

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

    useEffect(() => {
        console.log('Initial Current Date:', {
            fullDate: currentDate,
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear(),
            isoString: currentDate.toISOString(),
            localString: currentDate.toLocaleString()
        });
    }, []);

    const fetchReportData = async () => {
        try {
            if (!isAuthenticated) {
                navigation.navigate('Login');
                return;
            }

            setLoading(true);
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();

            console.log('Fetching report for:', { month, year });
            const reportData = await reportsService.getMonthlyReport(month, year);
            console.log('Report Data Received:', reportData);

            if (reportData && reportData.length > 0) {
                const firstRow = reportData[0];

                // The values are already numbers from the API
                setExpenseTotal(firstRow.total_expense);
                setIncomeTotal(firstRow.total_income);
                setInvestmentTotal(firstRow.total_investment);
                setNetBalance(firstRow.total_net_balance);

                // Transform category data - no need to parse numbers
                const transformedCategories = reportData.map(item => ({
                    category: item.category_name,
                    amount: item.category_amount,
                    color: item.category_color || '#CCCCCC',
                    icon: item.category_icon || 'help-outline',
                    percentage: item.category_percentage,
                    type: item.category_type
                }));

                console.log('Transformed Categories:', transformedCategories);
                setCategoryTotals(transformedCategories);
            } else {
                console.log('No report data found');
                setExpenseTotal(0);
                setIncomeTotal(0);
                setInvestmentTotal(0);
                setNetBalance(0);
                setCategoryTotals([]);
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
            Alert.alert(
                'Error',
                'Failed to fetch report data. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [currentDate, isAuthenticated]);

    const handleDateChange = (newDate: Date) => {
        console.log('Date Changed:', {
            oldDate: currentDate,
            newDate: newDate,
            newMonth: newDate.getMonth() + 1,
            newYear: newDate.getFullYear(),
            newDateISO: newDate.toISOString()
        });

        setCurrentDate(newDate);
        fetchReportData();
    };

    const handleCategoryPress = (category: CategoryTotal) => {
        navigation.navigate('CategoryDetail', {
            category: category.category,
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear()
        });
    };

    const getPieChartData = () => {
        try {
            console.log('All Category Totals:', categoryTotals);
            console.log('Active Tab:', activeTab);

            const filteredCategories = categoryTotals.filter(cat => {
                const isMatchingType = cat.type === activeTab;
                const hasPositiveAmount = cat.amount > 0;
                console.log(`Category: ${cat.category}, Type: ${cat.type}, Amount: ${cat.amount}, Matches: ${isMatchingType && hasPositiveAmount}`);
                return isMatchingType && hasPositiveAmount;
            });

            console.log('Filtered Categories:', filteredCategories);

            // If no data, return a default "No Data" entry
            if (filteredCategories.length === 0) {
                console.log('No categories found, returning default data');
                return [{
                    name: 'No Data',
                    value: 1,
                    color: '#CCCCCC',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12
                }];
            }

            return filteredCategories.map(category => ({
                name: category.category,
                value: category.amount,
                color: category.color || '#CCCCCC',
                legendFontColor: '#7F7F7F',
                legendFontSize: 12
            }));
        } catch (error) {
            console.error('Error in getPieChartData:', error);
            return [{
                name: 'Error',
                value: 1,
                color: '#FF0000',
                legendFontColor: '#7F7F7F',
                legendFontSize: 12
            }];
        }
    };

    const renderPieChart = () => {
        try {
            const data = getPieChartData();
            console.log('Pie Chart Data:', data);

            if (!data || data.length === 0) {
                return (
                    <View style={styles.noDataContainer}>
                        <Text style={styles.noDataText}>No data available</Text>
                    </View>
                );
            }

            // Prepare data for SVG PieChart
            const pieData = data.map((item, index) => ({
                value: item.value,
                svg: {
                    fill: item.color,
                    onPress: () => console.log(`Pressed ${item.name}`)
                },
                key: `pie-${index}`
            }));

            const Labels = ({ slices }) => {
                return slices.map((slice, index) => {
                    const { pieCentroid, data } = slice;
                    return (
                        <SVGText
                            key={`label-${index}`}
                            x={pieCentroid[0]}
                            y={pieCentroid[1]}
                            fill={'white'}
                            textAnchor={'middle'}
                            alignmentBaseline={'middle'}
                            fontSize={12}
                        >
                            {data.value > 0 ? `${data.value}` : ''}
                        </SVGText>
                    );
                });
            };

            return (
                <View style={styles.chartContainer}>
                    <PieChart
                        style={{ height: 200, width: 200 }}
                        data={pieData}
                        innerRadius="0%"
                        outerRadius="80%"
                        labelRadius={80}
                    >
                        <Labels />
                    </PieChart>
                </View>
            );
        } catch (error) {
            console.error('Detailed PieChart Rendering Error:', {
                message: error.message,
                stack: error.stack,
                data: data
            });
            return (
                <View style={styles.noDataContainer}>
                    <MaterialIcons name="error-outline" size={50} color="#FF0000" />
                    <Text style={styles.noDataText}>Error rendering chart</Text>
                    <Text style={styles.noDataText}>{error.message}</Text>
                </View>
            );
        }
    };

    const renderCategoryList = () => {
        const filteredCategories = categoryTotals.filter(cat => cat.type === activeTab);

        if (filteredCategories.length === 0) {
            return (
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>No categories for this period</Text>
                </View>
            );
        }

        return (
            <ScrollView style={styles.categoryList}>
                {filteredCategories.map((category, index) => (
                    <View key={index} style={styles.categoryItem}>
                        <View style={styles.categoryIconContainer}>
                            <MaterialIcons
                                name={category.icon as any}
                                size={24}
                                color={category.color}
                            />
                        </View>
                        <View style={styles.categoryDetails}>
                            <Text style={styles.categoryName}>{category.category}</Text>
                            <Text style={styles.categoryAmount}>
                                ${category.amount.toFixed(2)}
                            </Text>
                        </View>
                        <Text style={styles.categoryPercentage}>
                            {category.percentage.toFixed(1)}%
                        </Text>
                    </View>
                ))}
            </ScrollView>
        );
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={fetchReportData}
                    colors={['#2196F3']}
                    tintColor="#2196F3"
                />
            }
        >
            <MonthYearPicker
                currentDate={currentDate}
                onDateChange={handleDateChange}
            />

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2196F3" />
                </View>
            ) : (
                <>
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
                                onPress={() => setActiveTab(tab as any)}
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

                    {renderPieChart()}
                    {renderCategoryList()}
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollViewContent: {
        paddingVertical: 16,
        paddingHorizontal: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    chartContainer: {
        marginVertical: 16,
        alignItems: 'center',
        paddingHorizontal: 16,
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
        marginBottom: 12,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    summaryAmount: {
        fontSize: 16,
        fontWeight: '600',
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
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#2196F3',
    },
    tabText: {
        color: '#666',
        fontSize: 14,
    },
    activeTabText: {
        color: '#2196F3',
        fontWeight: '500',
    },
    categoryList: {
        paddingHorizontal: 16,
    },
    categoryItem: {
        marginBottom: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    categoryDetails: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    categoryAmount: {
        fontSize: 14,
        color: '#666',
    },
    categoryPercentage: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noDataText: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
    },
});

export default ReportScreen;