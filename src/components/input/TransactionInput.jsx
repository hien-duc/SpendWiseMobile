import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
    Alert,
    ActivityIndicator,
    Pressable,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { api } from '../../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';

const TransactionInput = ({ visible, onClose }) => {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [date, setDate] = useState(new Date());
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [transactionType, setTransactionType] = useState('expense');
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const fetchedCategories = await api.getCategories();
            setCategories(fetchedCategories);
        } catch (error) {
            Alert.alert('Error', 'Failed to load categories');
        }
    };

    const handleSubmit = async () => {
        if (!amount || !selectedCategory) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            const transactionData = {
                amount: parseFloat(amount),
                category_id: selectedCategory.id,
                note: note || 'Not entered',
                date: date.toISOString(),
                type: transactionType,
            };

            await api.createTransaction(transactionData);
            Alert.alert('Success', 'Transaction created successfully');
            resetForm();
            onClose();
        } catch (error) {
            Alert.alert('Error', 'Failed to create transaction');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setAmount('');
        setNote('');
        setSelectedCategory(null);
        setDate(new Date());
        setTransactionType('expense');
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const addNewCategory = () => {
        // Navigate to category creation screen
        Alert.alert('Coming Soon', 'Category creation will be available soon!');
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Spend Wise</Text>
                    <TouchableOpacity onPress={onClose}>
                        <MaterialCommunityIcons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <View style={styles.typeSelector}>
                    {['expense', 'income', 'investment'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.typeButton,
                                transactionType === type && styles.selectedTypeButton,
                                transactionType === type && { borderBottomColor: type === 'expense' ? '#FF5722' : type === 'income' ? '#4CAF50' : '#2196F3' }
                            ]}
                            onPress={() => setTransactionType(type)}
                        >
                            <Text style={[
                                styles.typeText,
                                transactionType === type && styles.selectedTypeText,
                                transactionType === type && { color: type === 'expense' ? '#FF5722' : type === 'income' ? '#4CAF50' : '#2196F3' }
                            ]}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <ScrollView style={styles.content}>
                    {/* Date Selector */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Date</Text>
                        <Pressable
                            style={styles.dateInput}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.dateText}>
                                {date.toLocaleDateString('en-US', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    weekday: 'short'
                                })}
                            </Text>
                            <MaterialCommunityIcons name="calendar" size={24} color="#666" />
                        </Pressable>
                    </View>

                    {/* Note Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Note</Text>
                        <TextInput
                            style={styles.input}
                            value={note}
                            onChangeText={setNote}
                            placeholder="Not entered"
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Amount Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}</Text>
                        <View style={styles.amountContainer}>
                            <TextInput
                                style={styles.amountInput}
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="decimal-pad"
                                placeholder="0"
                                placeholderTextColor="#999"
                            />
                            <Text style={styles.currency}>₩</Text>
                        </View>
                    </View>

                    {/* Categories */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Category</Text>
                        <View style={styles.categoriesGrid}>
                            {categories
                                .filter(cat => cat.type === transactionType)
                                .map((category) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        style={[
                                            styles.categoryItem,
                                            selectedCategory?.id === category.id && styles.selectedCategory
                                        ]}
                                        onPress={() => setSelectedCategory(category)}
                                    >
                                        <MaterialCommunityIcons
                                            name={category.icon}
                                            size={24}
                                            color={category.color}
                                        />
                                        <Text style={styles.categoryName}>{category.name}</Text>
                                    </TouchableOpacity>
                                ))
                            }
                            <TouchableOpacity
                                style={styles.addCategoryButton}
                                onPress={addNewCategory}
                            >
                                <MaterialCommunityIcons name="plus" size={24} color="#666" />
                                <Text style={styles.addCategoryText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        { backgroundColor: transactionType === 'expense' ? '#FF5722' : transactionType === 'income' ? '#4CAF50' : '#2196F3' }
                    ]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.submitText}>Submit</Text>
                    )}
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    typeSelector: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    typeButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    selectedTypeButton: {
        borderBottomWidth: 2,
    },
    typeText: {
        fontSize: 16,
        color: '#666',
    },
    selectedTypeText: {
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFF5F2',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
    },
    dateInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF5F2',
        borderRadius: 8,
        padding: 12,
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5F2',
        borderRadius: 8,
        padding: 12,
    },
    amountInput: {
        flex: 1,
        fontSize: 24,
        color: '#333',
        padding: 0,
    },
    currency: {
        fontSize: 24,
        color: '#333',
        marginLeft: 8,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
    categoryItem: {
        width: '25%',
        padding: 8,
        alignItems: 'center',
    },
    selectedCategory: {
        backgroundColor: '#FFF5F2',
        borderRadius: 8,
    },
    categoryName: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        textAlign: 'center',
    },
    addCategoryButton: {
        width: '25%',
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addCategoryText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    submitButton: {
        margin: 16,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default TransactionInput;
