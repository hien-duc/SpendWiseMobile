// src/screens/HomeScreen.tsx
import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {transactionsService} from '../api/transactionsService';
import {Transaction} from '../api/types';
import {useAuth} from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

function HomeScreen({navigation}): JSX.Element {
  const [transactions, setTransactions] = useState([]);
  const {isAuthenticated: authIsAuthenticated} = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const loadTransaction = async () => {
    try {
      const fetchedTransactions = await transactionsService.getAll();
      console.log('Fetched transactions', fetchedTransactions);

      if (
        !fetchedTransactions ||
        !Array.isArray(fetchedTransactions) ||
        fetchedTransactions.length === 0
      ) {
        setTransactions([]);
        return;
      }

      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setTransactions([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log('HomeScreen focused - refreshing transactions');
      if (authIsAuthenticated) {
        loadTransaction();
      }
    }, [authIsAuthenticated])
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadTransaction();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const CalendarTable = ({
    selectedDate,
    onDateSelect,
    onMonthChange,
  }: {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    onMonthChange: (date: Date) => void;
  }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const daysInMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0,
    ).getDate();
    const firstDayOfMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1,
    ).getDay();

    const getDayTransactions = (day: number) => {
      const dateStr = `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1,
      ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return transactions.filter(t => t.date === dateStr);
    };

    const handleDateChange = (event: any, date?: Date) => {
      setShowDatePicker(false);
      if (date) {
        onMonthChange(date);
      }
    };

    const renderCalendarDays = () => {
      const days = [];
      let dayCounter = 1;

      for (let i = 0; i < 6; i++) {
        const week = [];
        for (let j = 0; j < 7; j++) {
          if ((i === 0 && j < firstDayOfMonth) || dayCounter > daysInMonth) {
            week.push(
              <View key={`empty-${i}-${j}`} style={styles.calendarCell} />,
            );
          } else {
            const dayTransactions = getDayTransactions(dayCounter);
            const income = dayTransactions
              .filter(t => t.type === 'income')
              .reduce((sum, t) => sum + t.amount, 0);
            const expense = dayTransactions
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0);
            const investment = dayTransactions
              .filter(t => t.type === 'investment')
              .reduce((sum, t) => sum + t.amount, 0);

            const currentDay = new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              dayCounter,
            );
            const isSelected =
              currentDay.toDateString() === selectedDate.toDateString();

            week.push(
              <TouchableOpacity
                key={dayCounter}
                style={[
                  styles.calendarCell,
                  isSelected && styles.selectedCalendarCell,
                ]}
                onPress={() => {
                  onDateSelect(currentDay);
                }}>
                <Text
                  style={[
                    styles.dayNumber,
                    isSelected && styles.selectedDayNumber,
                  ]}>
                  {dayCounter}
                </Text>
                {income > 0 && (
                  <Text style={[styles.amount, styles.income]}>+{income}</Text>
                )}
                {expense > 0 && (
                  <Text style={[styles.amount, styles.expense]}>
                    -{expense}
                  </Text>
                )}
                {investment > 0 && (
                  <Text style={[styles.amount, styles.investment]}>
                    {investment}
                  </Text>
                )}
              </TouchableOpacity>,
            );
            dayCounter++;
          }
        }
        days.push(
          <View key={`week-${i}`} style={styles.calendarRow}>
            {week}
          </View>,
        );
        if (dayCounter > daysInMonth) break;
      }
      return days;
    };

    return (
      <View style={styles.calendar}>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}>
          <Text style={styles.datePickerButtonText}>
            {selectedDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={handleDateChange}
          />
        )}

        <View style={styles.calendarHeader}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Text key={day} style={styles.dayHeader}>
              {day}
            </Text>
          ))}
        </View>
        {renderCalendarDays()}
      </View>
    );
  };

  const MonthSummary = ({selectedDate}: {selectedDate: Date}) => {
    const currentMonth = selectedDate.getMonth() + 1;
    const currentYear = selectedDate.getFullYear();

    const monthTransactions = transactions.filter(t => {
      const [year, month] = t.date.split('-').map(Number);
      return year === currentYear && month === currentMonth;
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const investment = monthTransactions
      .filter(t => t.type === 'investment')
      .reduce((sum, t) => sum + t.amount, 0);
    const remaining = income - expense + investment;

    return (
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={[styles.summaryAmount, styles.income]}>+{income}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Expense</Text>
          <Text style={[styles.summaryAmount, styles.expense]}>-{expense}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Investment</Text>
          <Text style={[styles.summaryAmount, styles.investment]}>
            {investment}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Remaining</Text>
          <Text
            style={[
              styles.summaryAmount,
              {color: remaining >= 0 ? '#4CAF50' : '#FF5252'},
            ]}>
            {remaining}
          </Text>
        </View>
      </View>
    );
  };

  const TransactionList = ({
    selectedDate,
    listRef,
  }: {
    selectedDate: Date;
    listRef: React.RefObject<ScrollView>;
  }) => {
    const currentMonth = selectedDate.getMonth() + 1;
    const currentYear = selectedDate.getFullYear();

    const monthTransactions = transactions
      .filter(t => {
        const [year, month] = t.date.split('-').map(Number);
        return year === currentYear && month === currentMonth;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const groupedTransactions: {[key: string]: Transaction[]} = {};
    monthTransactions.forEach(transaction => {
      if (!groupedTransactions[transaction.date]) {
        groupedTransactions[transaction.date] = [];
      }
      groupedTransactions[transaction.date].push(transaction);
    });

    const selectedDateStr = `${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

    return (
      <View style={styles.transactionList}>
        {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
          <View
            key={date}
            style={[
              styles.transactionGroup,
              date === selectedDateStr && styles.selectedTransactionGroup,
            ]}
            onLayout={event => {
              if (date === selectedDateStr && listRef.current) {
                listRef.current.scrollTo({
                  y: event.nativeEvent.layout.y,
                  animated: true,
                });
              }
            }}>
            <Text style={styles.dateHeader}>{date}</Text>
            {dayTransactions.map(transaction => (
              <View key={transaction.id}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('TransactionEditScreen', {
                      transactionId: transaction.id,
                    });
                  }}
                  style={styles.transaction}>
                  <View style={styles.transactionLeft}>
                    <View style={styles.categoryContainer}>
                      <View
                        style={[
                          styles.iconContainer,
                          {backgroundColor: transaction.categories.color},
                        ]}>
                        <MaterialIcons
                          name={transaction.categories.icon}
                          size={20}
                          color="white"
                        />
                      </View>
                      <View style={styles.categoryTextContainer}>
                        <Text style={styles.transactionCategory}>
                          {transaction.categories.name}
                        </Text>
                        <Text style={styles.transactionNote}>
                          {transaction.note}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color:
                          transaction.type === 'income'
                            ? '#4CAF50'
                            : transaction.type === 'expense'
                            ? '#FF5252'
                            : '#607D8B',
                      },
                    ]}>
                    {transaction.type === 'income'
                      ? '+'
                      : transaction.type === 'expense'
                      ? '-'
                      : ''}
                    {transaction.amount}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };
  const isDarkMode = useColorScheme() === 'dark';
  const [selectedDate, setSelectedDate] = useState(
    new Date('2024-12-11T21:35:12+07:00'),
  );
  const scrollViewRef = useRef<ScrollView>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} ref={scrollViewRef}>
        <CalendarTable
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onMonthChange={handleMonthChange}
        />
        <MonthSummary selectedDate={selectedDate} />
        <TransactionList selectedDate={selectedDate} listRef={scrollViewRef} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  calendar: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  datePickerButton: {
    padding: 8,
    marginBottom: 16,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  datePickerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayHeader: {
    width: 40,
    textAlign: 'center',
    fontWeight: '600',
    color: '#666',
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  calendarCell: {
    width: 40,
    height: 60,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 4,
    borderRadius: 8,
  },
  selectedCalendarCell: {
    backgroundColor: '#e3f2fd',
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  selectedDayNumber: {
    color: '#1976d2',
    fontWeight: '700',
  },
  amount: {
    fontSize: 10,
    marginBottom: 1,
  },
  income: {
    color: '#4CAF50',
  },
  expense: {
    color: '#FF5252',
  },
  investment: {
    color: '#607D8B',
  },
  summary: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionList: {
    margin: 16,
    marginTop: 0,
  },
  transactionGroup: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionLeft: {
    flex: 1,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryTextContainer: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionNote: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
  },
  selectedTransactionGroup: {
    borderWidth: 2,
    borderColor: '#1976d2',
  },
});

export default HomeScreen;
