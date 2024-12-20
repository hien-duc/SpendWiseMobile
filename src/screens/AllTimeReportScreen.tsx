import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {LineChart} from 'react-native-chart-kit';
import {otherService} from '../api/otherService';
import {useAuth} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';

interface Props {}

interface AllTimeBalanceReport {
  income_amount: number;
  expense_amount: number;
  net_amount: number;
  avg_monthly_income: number;
  avg_monthly_expense: number;
  highest_income_monthly: number;
  highest_expense_monthly: number;
  initial_balance: number;
  cumulative_balance: number;
}

interface YearlyData {
  year: number;
  total_income: number;
  total_expense: number;
  net_amount: number;
}

const AllTimeReportScreen: React.FC<Props> = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [balanceReport, setBalanceReport] =
    useState<AllTimeBalanceReport | null>(null);
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);
  const {session} = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [balanceData, yearlyReport] = await Promise.all([
          otherService.getAllTimeBalanceReport(session),
          otherService.getFiveYearReport(session),
        ]);
        setBalanceReport(balanceData[0]); // Assuming the API returns an array with one item
        setYearlyData(yearlyReport);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An error occurred while fetching data',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 0,
    propsForDots: {
      r: '6',
      strokeWidth: '2',
    },
  };

  const chartData = {
    labels: yearlyData.map(data => data.year.toString()),
    datasets: [
      {
        data: yearlyData.map(data => data.total_income),
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: yearlyData.map(data => data.total_expense),
        color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: yearlyData.map(data => data.net_amount),
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Income', 'Expenses', 'Net'],
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!balanceReport) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>No balance report data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
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
              <Text style={[styles.summaryValue, styles.incomeText]}>
                {formatCurrency(balanceReport.income_amount)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={[styles.summaryValue, styles.expenseText]}>
                {formatCurrency(balanceReport.expense_amount)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Net Worth</Text>
              <Text style={[styles.summaryValue, styles.savingsText]}>
                {formatCurrency(balanceReport.net_amount)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yearly Trends</Text>
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 64}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            yAxisLabel="$"
            yAxisSuffix=""
            withVerticalLines={false}
            withHorizontalLines={true}
            withDots={true}
            withShadow={false}
            withScrollableDot={false}
            withInnerLines={true}
            fromZero
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Average Monthly Income</Text>
              <Text style={styles.statValue}>
                {formatCurrency(balanceReport.avg_monthly_income)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Average Monthly Expenses</Text>
              <Text style={styles.statValue}>
                {formatCurrency(balanceReport.avg_monthly_expense)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Highest Monthly Income</Text>
              <Text style={styles.statValue}>
                {formatCurrency(balanceReport.highest_income_monthly)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Highest Monthly Expenses</Text>
              <Text style={styles.statValue}>
                {formatCurrency(balanceReport.highest_expense_monthly)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Initial Balance</Text>
              <Text style={[styles.statValue, balanceReport.initial_balance >= 0 ? styles.incomeText : styles.expenseText]}>
                {formatCurrency(balanceReport.initial_balance)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Current Balance</Text>
              <Text style={[styles.statValue, balanceReport.cumulative_balance >= 0 ? styles.incomeText : styles.expenseText]}>
                {formatCurrency(balanceReport.cumulative_balance)}
              </Text>
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
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
  },
  errorText: {
    color: '#f44336',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AllTimeReportScreen;
