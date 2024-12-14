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
import { FinancialGoal, GoalStatus } from '../api/types';
import { useAuth } from '../hooks/useAuth';

const EditGoalScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { goal, userId } = route.params as { goal: FinancialGoal; userId: string };
    const { isAuthenticated } = useAuth();

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(goal.name);
    const [targetAmount, setTargetAmount] = useState(`$${goal.target_amount}`);
    const [currentAmount, setCurrentAmount] = useState(`$${goal.current_amount}`);
    const [deadline, setDeadline] = useState(new Date(goal.deadline));
    const [status, setStatus] = useState<GoalStatus>(goal.status);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStatusPicker, setShowStatusPicker] = useState(false);

    const handleSubmit = async () => {
        if (!isAuthenticated) {
            Alert.alert('Error', 'Please log in to edit the goal');
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
            await financialGoalsService.update(goal.id, {
                name: name.trim(),
                target_amount: target,
                current_amount: current,
                deadline: deadline.toISOString().split('T')[0],
                status,
            }, userId);

            Alert.alert(
                'Success',
                'Financial goal updated successfully',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error) {
            console.error('Error updating goal:', error);
            Alert.alert('Error', 'Failed to update goal. Please try again.');
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
                <Text style={styles.errorText}>Please log in to edit the goal</Text>
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
                    <View style={styles.inputWrapper}>
                        <MaterialIcons name="flag" size={24} color="#00B152" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter goal name"
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Target Amount</Text>
                    <View style={styles.inputWrapper}>
                        <MaterialIcons name="attach-money" size={24} color="#00B152" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={targetAmount}
                            onChangeText={(text) => handleAmountChange(text, setTargetAmount)}
                            placeholder="$0.00"
                            keyboardType="numeric"
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Current Amount</Text>
                    <View style={styles.inputWrapper}>
                        <MaterialIcons name="account-balance-wallet" size={24} color="#00B152" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={currentAmount}
                            onChangeText={(text) => handleAmountChange(text, setCurrentAmount)}
                            placeholder="$0.00"
                            keyboardType="numeric"
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Deadline</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <View style={styles.dateButtonContent}>
                            <MaterialIcons name="calendar-today" size={24} color="#00B152" style={styles.inputIcon} />
                            <Text style={styles.dateButtonText}>
                                {deadline.toLocaleDateString()}
                            </Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color="#666" />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Status</Text>
                    <TouchableOpacity
                        style={styles.statusButton}
                        onPress={() => {
                            Alert.alert(
                                'Select Status',
                                '',
                                [
                                    {
                                        text: 'In Progress',
                                        onPress: () => setStatus('in_progress'),
                                        style: 'default',
                                    },
                                    {
                                        text: 'Completed',
                                        onPress: () => setStatus('completed'),
                                        style: 'default',
                                    },
                                    {
                                        text: 'Cancelled',
                                        onPress: () => setStatus('cancelled'),
                                        style: 'destructive',
                                    },
                                    {
                                        text: 'Cancel',
                                        style: 'cancel',
                                    },
                                ]
                            );
                        }}
                    >
                        <View style={styles.statusButtonContent}>
                            <MaterialIcons name="check-circle" size={24} color="#00B152" style={styles.inputIcon} />
                            <Text style={styles.statusButtonText}>
                                {status.replace('_', ' ').toUpperCase()}
                            </Text>
                        </View>
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
                    style={[
                        styles.submitButton, 
                        (loading || !name.trim() || !targetAmount || !currentAmount) && styles.disabledButton
                    ]}
                    onPress={handleSubmit}
                    disabled={loading || !name.trim() || !targetAmount || !currentAmount}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <View style={styles.submitButtonContent}>
                            <MaterialIcons name="save" size={24} color="#fff" style={styles.submitButtonIcon} />
                            <Text style={styles.submitButtonText}>Update Goal</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    backButton: {
        padding: 8,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333333',
    },
    content: {
        padding: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    dateButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    dateButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateButtonText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 12,
    },
    statusButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    statusButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusButtonText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 12,
    },
    submitButton: {
        backgroundColor: '#00B152',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    submitButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonIcon: {
        marginRight: 8,
    },
    disabledButton: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        color: '#ff6b6b',
        textAlign: 'center',
        marginTop: 16,
    },
    loginButton: {
        backgroundColor: '#00B152',
        borderRadius: 12,
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

export default EditGoalScreen;
