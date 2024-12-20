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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!balanceReport) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No balance report data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All-Time Report</Text>
        <Text style={styles.headerSubtitle}>
          Get insights into your long-term financial journey
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Lifetime Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Total Income</Text>
            <Text style={[styles.value, styles.positiveValue]}>
              {formatCurrency(balanceReport.income_amount)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Expenses</Text>
            <Text style={[styles.value, styles.negativeValue]}>
              {formatCurrency(balanceReport.expense_amount)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Net Worth</Text>
            <Text
              style={[
                styles.value,
                balanceReport.net_amount >= 0
                  ? styles.positiveValue
                  : styles.negativeValue,
              ]}>
              {formatCurrency(balanceReport.net_amount)}
            </Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Yearly Trends</Text>
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

        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Key Statistics</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Average Monthly Income</Text>
            <Text style={styles.value}>
              {formatCurrency(balanceReport.avg_monthly_income)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Average Monthly Expenses</Text>
            <Text style={styles.value}>
              {formatCurrency(balanceReport.avg_monthly_expense)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Highest Monthly Income</Text>
            <Text style={styles.value}>
              {formatCurrency(balanceReport.highest_income_monthly)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Highest Monthly Expenses</Text>
            <Text style={styles.value}>
              {formatCurrency(balanceReport.highest_expense_monthly)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Initial Balance</Text>
            <Text
              style={[
                styles.value,
                balanceReport.initial_balance >= 0
                  ? styles.positiveValue
                  : styles.negativeValue,
              ]}>
              {formatCurrency(balanceReport.initial_balance)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Current Balance</Text>
            <Text
              style={[
                styles.value,
                balanceReport.cumulative_balance >= 0
                  ? styles.positiveValue
                  : styles.negativeValue,
              ]}>
              {formatCurrency(balanceReport.cumulative_balance)}
            </Text>
          </View>
        </View>
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
    backgroundColor: '#4CAF50',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    marginTop: -25,
    paddingBottom: 20,
    color: 'white',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    fontSize: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: '#666666',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  positiveValue: {
    color: '#34C759',
  },
  negativeValue: {
    color: '#FF3B30',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
});

export default AllTimeReportScreen;
