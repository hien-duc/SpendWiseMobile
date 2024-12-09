import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DayProps {
  day: number;
  isToday?: boolean;
  hasTransaction?: boolean;
  transactionAmount?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Day = ({ day, isToday, hasTransaction, transactionAmount }: DayProps) => (
  <View style={[styles.dayContainer, isToday && styles.today]}>
    <Text style={[styles.dayText, isToday && styles.todayText]}>{day}</Text>
    {hasTransaction && (
      <Text style={styles.transactionText}>{transactionAmount}</Text>
    )}
  </View>
);

const CalendarGrid = () => {
  return (
    <View style={styles.container}>
      {/* Week day header will be a separate component */}
      <View style={styles.daysGrid}>
        {/* Days will be rendered here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayContainer: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  today: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  dayText: {
    fontSize: 14,
  },
  todayText: {
    fontWeight: 'bold',
  },
  transactionText: {
    fontSize: 10,
    color: '#FF6B6B',
  },
});

export default CalendarGrid;
