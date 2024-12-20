import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transaction</Text>
      </View>
      <View style={styles.form}>
        <TransactionInput
          visible={isModalVisible}
          onClose={handleModalClose}
          type="expense"
          style={styles.inputContainer}
        />
      </View>
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
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E3A59',
    letterSpacing: 0.5,
  },
  form: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: '#F7F9FC',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2E3A59',
    borderWidth: 1,
    borderColor: '#E4E9F2',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#F7F9FC',
    borderRadius: 16,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  selectedType: {
    backgroundColor: '#4CAF50',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8F9BB3',
  },
  selectedTypeText: {
    color: '#FFFFFF',
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  categoryButton: {
    width: '30%',
    aspectRatio: 1,
    margin: 8,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    borderWidth: 1,
    borderColor: '#E4E9F2',
  },
  selectedCategory: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  categoryIcon: {
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#2E3A59',
    textAlign: 'center',
  },
  submitButton: {
    height: 56,
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default TransactionScreen;
