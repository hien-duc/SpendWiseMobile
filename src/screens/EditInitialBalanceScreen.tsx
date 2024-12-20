import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { profilesService } from '../api/profilesService';

const EditInitialBalanceScreen = () => {
    const navigation = useNavigation();
    const [balance, setBalance] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Fetch current initial balance when screen loads
    useEffect(() => {
        const fetchInitialBalance = async () => {
            try {
                const profile = await profilesService.getCurrentProfile();
                setBalance((profile.initial_balance || 0).toFixed(2));
            } catch (error) {
                console.error('Failed to fetch initial balance:', error);
                Alert.alert('Error', 'Failed to load initial balance');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchInitialBalance();
    }, []);

    const handleSave = async () => {
        if (!balance) {
            Alert.alert('Error', 'Please enter a balance');
            return;
        }

        // Clean the balance string and convert to number
        const cleanBalance = balance.replace(/[^0-9.-]/g, '');
        const numericBalance = parseFloat(cleanBalance);

        if (isNaN(numericBalance)) {
            Alert.alert('Error', 'Please enter a valid number');
            return;
        }

        // Validate against decimal(12,2) constraints
        const wholePart = Math.floor(Math.abs(numericBalance)).toString();
        if (wholePart.length > 10) {
            Alert.alert('Error', 'Balance value is too large. Maximum 10 digits before decimal point.');
            return;
        }

        try {
            setLoading(true);
            await profilesService.updateInitialBalance(numericBalance);
            Alert.alert(
                'Success',
                'Initial balance updated successfully',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } catch (error) {
            console.error('Failed to update initial balance:', error);
            const errorMessage = error.message || 'Failed to update initial balance. Please try again.';
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const formatBalance = (text: string) => {
        // Remove any non-numeric characters except decimal point and minus sign
        const numericValue = text.replace(/[^0-9.-]/g, '');

        // Handle negative sign (only allow at start)
        const hasNegative = numericValue.startsWith('-');
        const cleanValue = numericValue.replace(/-/g, '');

        // Ensure only one decimal point
        const parts = cleanValue.split('.');
        if (parts.length > 2) {
            return balance; // Return previous value if multiple decimal points
        }

        // Limit whole number part to 10 digits (for decimal(12,2))
        if (parts[0].length > 10) {
            parts[0] = parts[0].slice(0, 10);
        }

        // Format with commas for thousands
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // Limit decimal places to 2
        const decimalPart = parts[1] ? `.${parts[1].slice(0, 2)}` : '';

        // Add negative sign back if needed
        return (hasNegative ? '-' : '') + integerPart + decimalPart;
    };

    if (initialLoading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
        // ios
            behavior={Platform.OS === 'android' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    disabled={loading}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Initial Balance</Text>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text style={[styles.saveButtonText, loading && styles.disabledText]}>
                        {loading ? 'Saving...' : 'Save'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>Initial Balance</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                        style={styles.input}
                        value={balance}
                        onChangeText={(text) => setBalance(formatBalance(text))}
                        keyboardType="numeric"
                        placeholder="0.00"
                        placeholderTextColor="#999"
                        autoFocus
                        editable={!loading}
                    />
                </View>
                <Text style={styles.hint}>
                    This is your account's starting balance
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    backButton: {
        padding: 8,
        borderRadius: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#334155',
        letterSpacing: 0.2,
    },
    saveButton: {
        padding: 8,
        borderRadius: 8,
    },
    saveButtonText: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    disabledText: {
        opacity: 0.5,
    },
    content: {
        padding: 24,
        paddingTop: 32,
    },
    label: {
        fontSize: 15,
        color: '#94A3B8',
        marginBottom: 12,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        height: 72,
    },
    currencySymbol: {
        fontSize: 28,
        color: '#334155',
        marginRight: 12,
        fontWeight: '500',
    },
    input: {
        flex: 1,
        fontSize: 28,
        color: '#334155',
        padding: 16,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    hint: {
        fontSize: 13,
        color: '#94A3B8',
        marginTop: 12,
        letterSpacing: 0.2,
        lineHeight: 18,
    },
});

export default EditInitialBalanceScreen;
