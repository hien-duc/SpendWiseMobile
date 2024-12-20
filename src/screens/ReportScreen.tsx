import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {reportsService} from '../api/reportsService';
import {Dimensions} from 'react-native';
import {useAuth} from '../context/AuthContext';
import MonthYearPicker from '../components/MonthYearPicker';
import Svg, {G, Path, Circle, Text as SvgText} from 'react-native-svg';

const {width} = Dimensions.get('window');
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
  categoryId?: string;
}

const ReportScreen = () => {
  const navigation = useNavigation();
  const {isAuthenticated, logout} = useAuth();
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [investmentTotal, setInvestmentTotal] = useState(0);
  const [netBalance, setNetBalance] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'expense' | 'income' | 'investment'
  >('expense');

  const fetchReportData = async () => {
    try {
      if (!isAuthenticated) {
        navigation.navigate('Auth', {screen: 'Login'});
        return;
      }

      setLoading(true);
      const date = currentDate || new Date();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      console.log('Fetching report for:', {month, year});
      const reportData = await reportsService.getMonthlyReport(month, year);
      console.log('Report Data Received:', reportData);

      if (reportData && reportData.length > 0) {
        const firstRow = reportData[0];
        setExpenseTotal(firstRow.total_expense);
        setIncomeTotal(firstRow.total_income);
        setInvestmentTotal(firstRow.total_investment);
        setNetBalance(firstRow.net_balance);

        const transformedCategories = reportData.map(item => ({
          category: item.category_name,
          amount: item.category_amount,
          color: item.category_color || '#CCCCCC',
          icon: item.category_icon || 'help-outline',
          percentage: item.category_percentage,
          type: item.category_type,
          categoryId: item.category_id,
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

  const handleCategoryClick = (category: CategoryTotal) => {
    navigation.navigate('CategoryDetailScreen', {
      categoryId: category.categoryId,
      categoryName: category.category,
      categoryColor: category.color,
      categoryIcon: category.icon,
      year: currentDate.getFullYear(),
    });
  };

  const renderPieChart = () => {
    console.log('Rendering Pie Chart');
    const filteredCategories = categoryTotals.filter(
      cat => cat.type === activeTab && cat.amount > 0,
    );

    console.log('Filtered Categories:', filteredCategories);

    if (filteredCategories.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <MaterialIcons name="donut-large" size={48} color="#ccc" />
          <Text style={styles.noDataText}>
            No data available for this period
          </Text>
        </View>
      );
    }

    const total = filteredCategories.reduce((sum, cat) => sum + cat.amount, 0);
    let currentAngle = 0;

    // Handle single category case
    if (filteredCategories.length === 1) {
      return (
        <View style={styles.chartContainer}>
          <Svg width={CHART_SIZE} height={CHART_SIZE}>
            <G x={CENTER} y={CENTER}>
              <Circle r={RADIUS} fill={filteredCategories[0].color} />
              <Circle cx={0} cy={0} r={15} fill="white" />
              <MaterialIcons
                name={filteredCategories[0].icon}
                size={20}
                color={filteredCategories[0].color}
                style={{
                  position: 'absolute',
                  left: CENTER - 10,
                  top: CENTER - 10,
                }}
              />
            </G>
          </Svg>

          <View style={styles.legendContainer}>
            <TouchableOpacity
              style={styles.legendItem}
              onPress={() => handleCategoryClick(filteredCategories[0])}>
              <View style={styles.legendIconContainer}>
                <MaterialIcons
                  name={filteredCategories[0].icon}
                  size={24}
                  color={filteredCategories[0].color}
                />
              </View>
              <View style={styles.legendTextContainer}>
                <Text style={styles.legendTitle}>
                  {filteredCategories[0].category}
                </Text>
                <Text style={styles.legendAmount}>
                  ${filteredCategories[0].amount.toFixed(2)} (100%)
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.chartContainer}>
        <Svg width={CHART_SIZE} height={CHART_SIZE}>
          <G x={CENTER} y={CENTER}>
            {filteredCategories.map((category, index) => {
              const percentage = (category.amount / total) * 100;
              const angle = (percentage / 100) * 360;
              const x1 =
                Math.cos(((currentAngle - 90) * Math.PI) / 180) * RADIUS;
              const y1 =
                Math.sin(((currentAngle - 90) * Math.PI) / 180) * RADIUS;
              const x2 =
                Math.cos(((currentAngle + angle - 90) * Math.PI) / 180) *
                RADIUS;
              const y2 =
                Math.sin(((currentAngle + angle - 90) * Math.PI) / 180) *
                RADIUS;

              // Calculate position for icon and label
              const midAngle = currentAngle + angle / 2;
              const iconRadius = RADIUS * 0.6;
              const iconX =
                Math.cos(((midAngle - 90) * Math.PI) / 180) * iconRadius;
              const iconY =
                Math.sin(((midAngle - 90) * Math.PI) / 180) * iconRadius;

              const path = `M 0 0 L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${
                angle > 180 ? 1 : 0
              } 1 ${x2} ${y2} Z`;

              const result = (
                <G key={index}>
                  <Path d={path} fill={category.color} />
                  <Circle cx={iconX} cy={iconY} r={15} fill="white" />
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
            <TouchableOpacity
              key={index}
              style={styles.legendItem}
              onPress={() => handleCategoryClick(category)}>
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
                  ${category.amount.toFixed(2)} (
                  {category.percentage.toFixed(1)}%)
                </Text>
              </View>
            </TouchableOpacity>
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
        <RefreshControl refreshing={loading} onRefresh={fetchReportData} />
      }>
      <View style={styles.header}>
        <MonthYearPicker
          selectedDate={currentDate}
          onDateChange={handleDateChange}
        />
      </View>

      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, {backgroundColor: '#E8F5E9'}]}>
          <Text style={styles.summaryLabel}>Income</Text>
          {/* can use to toFixed(2) to display 0.00 */}
          <Text style={[styles.summaryAmount, {color: '#2E7D32'}]}>
            ${incomeTotal}
          </Text>
        </View>
        <View style={[styles.summaryCard, {backgroundColor: '#FFEBEE'}]}>
          <Text style={styles.summaryLabel}>Expense</Text>
          <Text style={[styles.summaryAmount, {color: '#C62828'}]}>
            ${expenseTotal}
          </Text>
        </View>
        <View style={[styles.summaryCard, {backgroundColor: '#E3F2FD'}]}>
          <Text style={styles.summaryLabel}>Investment</Text>
          <Text style={[styles.summaryAmount, {color: '#1565C0'}]}>
            ${investmentTotal}
          </Text>
        </View>
      </View>

      <View style={styles.netBalanceContainer}>
        <Text style={styles.netBalanceLabel}>Net Balance</Text>
        <Text
          style={[
            styles.netBalanceAmount,
            {color: netBalance >= 0 ? '#2E7D32' : '#C62828'},
          ]}>
          ${netBalance ? netBalance : '0.00'}
        </Text>
      </View>

      <View style={styles.tabContainer}>
        {(['expense', 'income', 'investment'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Loading data...</Text>
        </View>
      ) : (
        renderPieChart()
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
    paddingBottom: 72,
    padding: 16,
  },
  header: {
    marginBottom: 0,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  netBalanceContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 6,
    alignItems: 'center',
  },
  netBalanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  netBalanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
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
    backgroundColor: '#fff',
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#6200ee',
    fontWeight: '500',
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  legendContainer: {
    width: '100%',
    marginTop: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
    padding: 8,
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
    fontSize: 14,
    fontWeight: '500',
  },
  legendAmount: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  noDataText: {
    marginTop: 8,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
  },
});

export default ReportScreen;
