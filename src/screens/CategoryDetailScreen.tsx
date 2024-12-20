import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {reportsService} from '../api/reportsService';
import {useAuth} from '../context/AuthContext';

const {width} = Dimensions.get('window');
const BAR_WIDTH = (width - 64) / 12; // Divide available space by 12 months
const CHART_HEIGHT = 220;

interface CategoryTrendData {
  month: number;
  month_name: string;
  amount: number;
  category_name: string;
  category_icon: string;
  category_color: string;
  category_type: string;
  date_label: string;
  latest_transaction_date: string;
}

const CategoryDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {isAuthenticated, logout} = useAuth();
  const {categoryId, categoryName, categoryColor, categoryIcon, year} =
    route.params;
  const [trendData, setTrendData] = useState<CategoryTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxAmount, setMaxAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [barHeights, setBarHeights] = useState<Animated.Value[]>([]);

  const initializeAnimations = (dataLength: number) => {
    const newBarHeights = Array(dataLength)
      .fill(0)
      .map(() => new Animated.Value(0));
    setBarHeights(newBarHeights);
    return newBarHeights;
  };

  const fetchCategoryTrend = async () => {
    try {
      if (!isAuthenticated) {
        navigation.navigate('Auth', {screen: 'Login'});
        return;
      }

      setLoading(true);
      const data = await reportsService.getCategoryTrend(year, categoryId);
      setTrendData(data);

      const max = Math.max(...data.map(d => Number(d.amount)), 1);
      setMaxAmount(max);

      const total = data.reduce((sum, item) => sum + Number(item.amount), 0);
      setTotalAmount(total);

      // Initialize animations with the new data length
      const newBarHeights = initializeAnimations(data.length);

      // Animate bars
      Animated.parallel(
        newBarHeights.map(barHeight =>
          Animated.spring(barHeight, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: false,
          }),
        ),
      ).start();
    } catch (error) {
      console.error('Error fetching category trend:', error);
      if (error.response?.status === 401) {
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please log in again.',
          [
            {
              text: 'OK',
              onPress: async () => {
                await logout();
                navigation.navigate('Auth', {screen: 'Login'});
              },
            },
          ],
        );
      } else {
        Alert.alert(
          'Error',
          'Unable to fetch category trend data. Please try again.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryTrend();
  }, [categoryId, year]);

  const renderBar = (data: CategoryTrendData, index: number) => {
    if (!barHeights[index]) return null;

    const barHeight = (Number(data.amount) / maxAmount) * CHART_HEIGHT;
    const animatedHeight = barHeights[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, barHeight],
    });

    return (
      <View key={index} style={styles.barContainer}>
        <View style={styles.barWrapper}>
          <Animated.View
            style={[
              styles.bar,
              {
                height: animatedHeight,
                backgroundColor: categoryColor,
                opacity: data.amount > 0 ? 1 : 0.3,
              },
            ]}
          />
          {data.amount > 0 && (
            <Animated.Text
              style={[
                styles.barValue,
                {
                  bottom: animatedHeight,
                },
              ]}>
              ${Number(data.amount).toLocaleString()}
            </Animated.Text>
          )}
        </View>
        <Text style={styles.barLabel}>{data.month_name.substring(0, 3)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#334155" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <MaterialIcons name={categoryIcon} size={28} color="#334155" />
          <Text style={styles.title}>{categoryName}</Text>
        </View>
        <View style={styles.yearBadge}>
          <Text style={styles.yearText}>{year}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={categoryColor} />
          <Text style={styles.loadingText}>Loading data...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Amount</Text>
            <Text style={[styles.summaryAmount, {color: categoryColor}]}>
              ${totalAmount.toLocaleString()}
            </Text>
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Monthly Trend</Text>
            <View style={styles.chartCard}>
              <View style={styles.barsContainer}>
                {trendData.map((data, index) => renderBar(data, index))}
              </View>
            </View>
          </View>
        </ScrollView>
      )}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
    color: '#334155',
    letterSpacing: 0.2,
  },
  yearBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  yearText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 0.2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  summaryLabel: {
    fontSize: 15,
    color: '#94A3B8',
    marginBottom: 12,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  chartContainer: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 20,
    letterSpacing: 0.2,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: CHART_HEIGHT + 80,
    paddingTop: 60,
  },
  barContainer: {
    width: BAR_WIDTH,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barWrapper: {
    height: CHART_HEIGHT,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  bar: {
    width: BAR_WIDTH - 8,
    borderRadius: 6,
  },
  barLabel: {
    marginTop: -6,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  barValue: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    position: 'absolute',
    textAlign: 'center',
    letterSpacing: 0.2,
    width: BAR_WIDTH * 1.5,
    marginBottom: 8,
  },
});

export default CategoryDetailScreen;
