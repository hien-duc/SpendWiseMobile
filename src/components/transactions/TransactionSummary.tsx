import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TransactionSummaryProps {
  income: string;
  expense: string;
  total: string;
}

const TransactionSummary = ({ income, expense, total }: TransactionSummaryProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.summaryItem}>
        <Text style={styles.label}>Income</Text>
        <Text style={[styles.amount, styles.incomeText]}>{income}₩</Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.label}>Expense</Text>
        <Text style={[styles.amount, styles.expenseText]}>{expense}₩</Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.label}>Total</Text>
        <Text style={[styles.amount, styles.totalText]}>{total}₩</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryItem: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#FF6B6B',
  },
  totalText: {
    color: '#000',
  },
});

export default TransactionSummary;
