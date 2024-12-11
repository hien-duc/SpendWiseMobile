import React, { useState, useEffect, useCallback } from 'react';
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
import { transactionsService } from '../../api/transactionsService';
import { categoriesService } from '../../api/categoriesService';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../../supabase';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';
import { useAuthGuard } from '../../hooks/useAuthGuard';

const TransactionInput = ({
    visible,
    onClose,
    type,
    navigation = {},
    onAddCategory
}) => {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [date, setDate] = useState(new Date());
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [transactionType, setTransactionType] = useState(type || 'expense');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthAlertShown, setIsAuthAlertShown] = useState(false);
    const [showLocalCategoryModal, setShowLocalCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryIcon, setNewCategoryIcon] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState('');

    const availableIcons = [
        'label', 'fastfood', 'shopping_bag', 'directions_car', 'home',
        'school', 'health_and_safety', 'sports', 'movie', 'flight',
        'computer', 'pets', 'fitness_center', 'local_grocery_store'
    ];

    const availableColors = [
        '#4CAF50', '#2196F3', '#F44336', '#FFC107', '#9C27B0',
        '#FF5722', '#795548', '#607D8B', '#E91E63', '#00BCD4'
    ];

    const { isAuthenticated: authIsAuthenticated } = useAuth();

    // Comprehensive reset function
    const resetForm = useCallback(() => {
        setAmount('');
        setNote('');
        setSelectedCategory(null);
        setDate(new Date());
        setTransactionType(type || 'expense');
        setShowDatePicker(false);
        setShowLocalCategoryModal(false);
        setNewCategoryName('');
        setNewCategoryIcon('');
        setNewCategoryColor('');
    }, [type]);

    useEffect(() => {
        if (authIsAuthenticated) {
            loadCategories();
        }
    }, [transactionType, authIsAuthenticated]);

    const loadCategories = async () => {
        try {
            console.log('Loading categories for transaction type:', transactionType);

            const fetchedCategories = await categoriesService.getAll(transactionType);
            console.log('Fetched categories:', fetchedCategories);

            if (!fetchedCategories || !Array.isArray(fetchedCategories) || fetchedCategories.length === 0) {
                console.warn('Invalid or empty categories array for transaction type:', transactionType);
                setCategories([]);
                return;
            }

            setCategories(fetchedCategories);
        } catch (error) {
            console.error('Failed to load categories:', error);
            setCategories([]);
        }
    };

    const handleModalClose = () => {
        resetForm();
        onClose();
    };

    const handleTransactionTypeChange = (type) => {
        setTransactionType(type);
        setSelectedCategory(null); // Reset selected category when type changes
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

            // Debug: Check token before making request
            const token = await AsyncStorage.getItem('token');
            console.log('Current token:', token);

            await transactionsService.create(transactionData);
            console.log('Transaction created successfully:', transactionData);
            Alert.alert('Success', 'Transaction created successfully');
            resetForm();
            onClose();
        } catch (error) {
            console.error('Failed to create transaction:', error);

            // More detailed error logging
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
            }

            Alert.alert(
                'Error',
                `Failed to create transaction: ${error.message || 'Unknown error'}`,
                [
                    {
                        text: 'OK',
                        onPress: () => console.log('Transaction creation error alert dismissed')
                    }
                ]
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const addNewCategory = async () => {
        try {
            // Check if user is authenticated
            const session = await supabase.auth.getSession();

            if (!session.data.session) {
                // User is not logged in
                Alert.alert(
                    'Authentication Required',
                    'Please log in to manage categories.',
                    [
                        {
                            text: 'Login',
                            onPress: () => {
                                // Try navigation first
                                if (navigation.navigate) {
                                    navigation.navigate('Auth');
                                }
                                // Fallback to onAddCategory if provided
                                else if (onAddCategory) {
                                    onAddCategory('login');
                                }
                            }
                        },
                        { text: 'Cancel', style: 'cancel' }
                    ]
                );
                return;
            }

            // Attempt to navigate or use callback
            if (navigation.navigate) {
                navigation.navigate('CategoryManagement', {
                    initialType: transactionType
                });
            }
            // Fallback to local category creation if no navigation
            else {
                // Open a local modal or bottom sheet for category creation
                setShowLocalCategoryModal(true);
            }
        } catch (error) {
            console.error('Error checking authentication:', error);
            Alert.alert(
                'Error',
                'An error occurred. Please try again.'
            );
        }
    };

    const createLocalCategory = async () => {
        try {
            // Validate inputs
            if (!newCategoryName.trim()) {
                Alert.alert('Error', 'Please enter a category name');
                return;
            }

            if (!newCategoryIcon) {
                Alert.alert('Error', 'Please select an icon');
                return;
            }

            if (!newCategoryColor) {
                Alert.alert('Error', 'Please select a color');
                return;
            }

            // Check authentication before creating category
            const session = await supabase.auth.getSession();

            if (!session.data.session) {
                // User is not logged in
                Alert.alert(
                    'Authentication Required',
                    'Please log in to create a category.',
                    [
                        {
                            text: 'Login',
                            onPress: () => {
                                // Navigate to login or show login modal
                                if (navigation && navigation.navigate) {
                                    navigation.navigate('Auth');
                                } else {
                                    // Fallback if no navigation
                                    console.log('No navigation available to login screen');
                                }
                            }
                        },
                        { text: 'Cancel', style: 'cancel' }
                    ]
                );
                return;
            }

            const newCategory = {
                name: newCategoryName.trim(),
                icon: newCategoryIcon,
                color: newCategoryColor,
                type: transactionType,
                description: ''
            };

            console.log('[TransactionInput] Creating category:', newCategory);

            // Create the category
            const createdCategory = await categoriesService.create(newCategory);

            console.log('[TransactionInput] Category created successfully:', createdCategory);

            // Refresh categories
            const updatedCategories = await categoriesService.getAll(transactionType);
            setCategories(updatedCategories);

            // Reset modal state
            setShowLocalCategoryModal(false);
            setNewCategoryName('');
            setNewCategoryIcon('');
            setNewCategoryColor('');

            // Optional: Select the newly created category
            setSelectedCategory(createdCategory);

            Alert.alert('Success', 'Category created successfully');
        } catch (error) {
            console.error('Failed to create category:', error);

            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
            }

            Alert.alert(
                'Error',
                `Failed to create category: ${error.message || 'Unknown error'}`,
                [
                    {
                        text: 'OK',
                        onPress: () => console.log('Category creation error alert dismissed')
                    }
                ]
            );
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={handleModalClose} // Ensure modal can be closed with back button
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Spend Wise</Text>
                    <TouchableOpacity onPress={handleModalClose}>
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
                            onPress={() => handleTransactionTypeChange(type)}
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
                    {/* Category Selector */}
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

                <Modal
                    visible={showLocalCategoryModal}
                    animationType="slide"
                    transparent={false}
                >
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Create Category</Text>
                            <TouchableOpacity onPress={() => setShowLocalCategoryModal(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.content}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={newCategoryName}
                                    onChangeText={setNewCategoryName}
                                    placeholder="Category name"
                                    placeholderTextColor="#999"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Icon</Text>
                                <View style={styles.categoriesGrid}>
                                    {availableIcons.map((icon) => (
                                        <TouchableOpacity
                                            key={icon}
                                            style={[
                                                styles.categoryItem,
                                                newCategoryIcon === icon && styles.selectedCategory
                                            ]}
                                            onPress={() => setNewCategoryIcon(icon)}
                                        >
                                            <MaterialCommunityIcons
                                                name={icon}
                                                size={24}
                                                color="#666"
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Color</Text>
                                <View style={styles.categoriesGrid}>
                                    {availableColors.map((color) => (
                                        <TouchableOpacity
                                            key={color}
                                            style={[
                                                styles.categoryItem,
                                                newCategoryColor === color && styles.selectedCategory
                                            ]}
                                            onPress={() => setNewCategoryColor(color)}
                                        >
                                            <View
                                                style={[
                                                    styles.categoryItem,
                                                    { backgroundColor: color, width: 24, height: 24 }
                                                ]}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>

                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                { backgroundColor: '#4CAF50' }
                            ]}
                            onPress={createLocalCategory}
                        >
                            <Text style={styles.submitText}>Create Category</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        </Modal>
    );
};

TransactionInput.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    type: PropTypes.oneOf(['expense', 'income', 'investment']),
    navigation: PropTypes.shape({
        navigate: PropTypes.func
    }),
    onAddCategory: PropTypes.func
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