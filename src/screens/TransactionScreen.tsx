import React, { useState } from 'react';
import { View } from 'react-native';
import TransactionInput from '../components/input/TransactionInput';

const TransactionScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      <TransactionInput 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        type="expense"
      />
    </View>
  );
};

export default TransactionScreen;