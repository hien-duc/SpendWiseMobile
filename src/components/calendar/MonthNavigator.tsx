import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface MonthNavigatorProps {
  currentMonth: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const MonthNavigator = ({ currentMonth, onPrevMonth, onNextMonth }: MonthNavigatorProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrevMonth}>
        <Icon name="chevron-left" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.monthText}>{currentMonth}</Text>
      <TouchableOpacity onPress={onNextMonth}>
        <Icon name="chevron-right" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF5EE',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MonthNavigator;
