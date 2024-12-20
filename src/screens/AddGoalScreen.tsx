import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { financialGoalsService } from '../api/financialGoalsService';
import { GoalStatus } from '../api/types';
import { useAuth } from '../hooks/useAuth';

const AddGoalScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { userId } = route.params as { userId: string };
    const { isAuthenticated } = useAuth();
    
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');
    const [deadline, setDeadline] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSubmit = async () => {
        if (!isAuthenticated) {
            Alert.alert('Error', 'Please log in to add a goal');
            navigation.navigate('Auth', { screen: 'Login' });
            return;
        }

        if (!name.trim() || !targetAmount || !currentAmount) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const target = parseFloat(targetAmount.replace(/[^0-9.]/g, ''));
        const current = parseFloat(currentAmount.replace(/[^0-9.]/g, ''));

        if (isNaN(target) || isNaN(current)) {
            Alert.alert('Error', 'Please enter valid amounts');
            return;
        }

        if (current > target) {
            Alert.alert('Error', 'Current amount cannot be greater than target amount');
            return;
        }

        try {
            setLoading(true);
            await financialGoalsService.create({
                name: name.trim(),
                target_amount: target,
                current_amount: current,
                deadline: deadline.toISOString().split('T')[0],
                status: 'in_progress' as GoalStatus,
            }, userId);

            Alert.alert(
                'Success',
                'Financial goal created successfully',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error) {
            console.error('Error creating goal:', error);
            Alert.alert('Error', 'Failed to create goal. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatAmount = (text: string) => {
        const number = text.replace(/[^0-9.]/g, '');
        const parts = number.split('.');
        const formatted = parts[0] + (parts.length > 1 ? '.' + parts[1].slice(0, 2) : '');
        return formatted ? `$${formatted}` : '';
    };

    const handleAmountChange = (text: string, setter: (value: string) => void) => {
        const formatted = formatAmount(text);
        setter(formatted);
    };

    if (!isAuthenticated) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Please log in to add a goal</Text>
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
                >
                    <Text style={styles.loginButtonText}>Go to Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.content}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Goal Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter goal name"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Target Amount</Text>
                    <TextInput
                        style={styles.input}
                        value={targetAmount}
                        onChangeText={(text) => handleAmountChange(text, setTargetAmount)}
                        placeholder="$0.00"
                        keyboardType="numeric"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Current Amount</Text>
                    <TextInput
                        style={styles.input}
                        value={currentAmount}
                        onChangeText={(text) => handleAmountChange(text, setCurrentAmount)}
                        placeholder="$0.00"
                        keyboardType="numeric"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Deadline</Text>
                    <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={styles.dateText}>
                            {deadline.toLocaleDateString()}
                        </Text>
                        <MaterialIcons name="chevron-right" size={24} color="#666" />
                    </TouchableOpacity>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={deadline}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                                setDeadline(selectedDate);
                            }
                        }}
                        minimumDate={new Date()}
                    />
                )}

                <TouchableOpacity
                    style={[styles.submitButton, (loading || !name.trim() || !targetAmount || !currentAmount) && styles.disabledButton]}
                    onPress={handleSubmit}
                    disabled={loading || !name.trim() || !targetAmount || !currentAmount}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitText}>Create Goal</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
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
    datePickerButton: {
        height: 56,
        backgroundColor: '#F7F9FC',
        borderRadius: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E4E9F2',
    },
    dateText: {
        fontSize: 16,
        color: '#2E3A59',
    },
    submitButton: {
        height: 56,
        backgroundColor: '#4CAF50',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32,
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
    errorText: {
        fontSize: 14,
        color: '#FF3D71',
        marginTop: 4,
    },
    loginButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 16,
        paddingVertical: 12,
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AddGoalScreen;
