import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import TransactionInput from '../components/input/TransactionInput';

const TransactionScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    // Open modal whenever route params change (including initial mount)
    setIsModalVisible(true);
  }, [route.params?.key]);

  const handleModalClose = () => {
    setIsModalVisible(false);
    // Navigate to Home instead of using goBack
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <TransactionInput
        visible={isModalVisible}
        onClose={handleModalClose}
        type="expense"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TransactionScreen;