import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { reportsService } from '../api/reportsService';
import { format } from 'date-fns';
import { Dimensions } from 'react-native';
import { useAuth } from '../context/AuthContext';
import MonthYearPicker from '../components/MonthYearPicker';
import Svg, { G, Path, Circle, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CHART_SIZE = width * 0.7;
const RADIUS = CHART_SIZE / 2;
const CENTER = CHART_SIZE / 2;

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
    const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
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
            const date = currentDate || new Date();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            console.log('Fetching report for:', { month, year });
            const reportData = await reportsService.getMonthlyReport(month, year);
            console.log('Report Data Received:', reportData);

            if (reportData && reportData.length > 0) {
                const firstRow = reportData[0];
                setExpenseTotal(firstRow.total_expense);
                setIncomeTotal(firstRow.total_income);
                setInvestmentTotal(firstRow.total_investment);
                setNetBalance(firstRow.total_net_balance);

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
            Alert.alert('Error', 'Failed to fetch report data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [currentDate, isAuthenticated]);

    const handleDateChange = (newDate: Date) => {
        if (!newDate) {
            newDate = new Date();
        }
        setCurrentDate(newDate);
        fetchReportData();
    };

    const renderPieChart = () => {
        const filteredCategories = categoryTotals.filter(cat => cat.type === activeTab && cat.amount > 0);

        if (filteredCategories.length === 0) {
            return (
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>No data available</Text>
                </View>
            );
        }

        const total = filteredCategories.reduce((sum, cat) => sum + cat.amount, 0);
        let currentAngle = 0;

        return (
            <View style={styles.chartContainer}>
                <Svg width={CHART_SIZE} height={CHART_SIZE}>
                    <G x={CENTER} y={CENTER}>
                        {filteredCategories.map((category, index) => {
                            const percentage = (category.amount / total) * 100;
                            const angle = (percentage / 100) * 360;
                            const x1 = Math.cos((currentAngle - 90) * Math.PI / 180) * RADIUS;
                            const y1 = Math.sin((currentAngle - 90) * Math.PI / 180) * RADIUS;
                            const x2 = Math.cos((currentAngle + angle - 90) * Math.PI / 180) * RADIUS;
                            const y2 = Math.sin((currentAngle + angle - 90) * Math.PI / 180) * RADIUS;

                            // Calculate position for icon and label
                            const midAngle = currentAngle + angle / 2;
                            const iconRadius = RADIUS * 0.6;
                            const iconX = Math.cos((midAngle - 90) * Math.PI / 180) * iconRadius;
                            const iconY = Math.sin((midAngle - 90) * Math.PI / 180) * iconRadius;

                            const path = `
                                M 0 0
                                L ${x1} ${y1}
                                A ${RADIUS} ${RADIUS} 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2}
                                Z
                            `;

                            const result = (
                                <G key={index}>
                                    <Path
                                        d={path}
                                        fill={category.color}
                                    />
                                    <Circle
                                        cx={iconX}
                                        cy={iconY}
                                        r={15}
                                        fill="white"
                                    />
                                    <MaterialIcons
                                        name={category.icon}
                                        size={20}
                                        color={category.color}
                                        style={{
                                            position: 'absolute',
                                            left: CENTER + iconX - 10,
                                            top: CENTER + iconY - 10,
                                        }}
                                    />
                                </G>
                            );

                            currentAngle += angle;
                            return result;
                        })}
                    </G>
                </Svg>

                <View style={styles.legendContainer}>
                    {filteredCategories.map((category, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View style={styles.legendIconContainer}>
                                <MaterialIcons
                                    name={category.icon}
                                    size={24}
                                    color={category.color}
                                />
                            </View>
                            <View style={styles.legendTextContainer}>
                                <Text style={styles.legendTitle}>{category.category}</Text>
                                <Text style={styles.legendAmount}>
                                    ${category.amount.toFixed(2)} ({category.percentage.toFixed(1)}%)
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
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
                selectedDate={currentDate || new Date()}
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
        paddingBottom: 62,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
    },
    chartContainer: {
        padding: 16,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
        margin: 16,
        marginBottom: 8,
    },
    legendContainer: {
        width: '100%',
        marginTop: 16,
        paddingHorizontal: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        padding: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    legendIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    legendTextContainer: {
        flex: 1,
    },
    legendTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    legendAmount: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
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
    summaryAmount: {
        fontSize: 16,
        fontWeight: '600',
    },
    expenseText: {
        color: '#F44336',
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
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
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
    noDataContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
    },
    noDataText: {
        fontSize: 16,
        color: '#666',
    },
});

export default ReportScreen;