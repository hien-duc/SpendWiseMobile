import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';
import ModifyTransaction from '../components/input/ModifyTransaction';

const TransactionEditScreen = ({route, navigation}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {transactionId} = route.params;
  console.log('Trans ID is' + transactionId);

  useEffect(() => {
    // Open modal whenever route params change (including initial mount)
    setIsModalVisible(true);
  }, [route.params?.key]);

  const handleModalClose = () => {
    setIsModalVisible(false);
    // Navigate to Home instead of using goBack
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ModifyTransaction
        visible={isModalVisible}
        onClose={handleModalClose}
        type="expense"
        transactionId={transactionId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TransactionEditScreen;
