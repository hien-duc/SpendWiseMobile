import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert, Linking } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { signOut } from '../../supabase';
import { useAuth } from '../context/AuthContext';
import { profilesService } from '../api/profilesService';

const SettingsScreen = () => {
    const navigation = useNavigation();
    const { logout } = useAuth();
    const [initialBalance, setInitialBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch initial balance when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            const fetchInitialBalance = async () => {
                try {
                    setLoading(true);
                    const profile = await profilesService.getCurrentProfile();
                    setInitialBalance(profile.initial_balance || 0);
                } catch (error) {
                    console.error('Failed to fetch initial balance:', error);
                    Alert.alert('Error', 'Failed to load initial balance');
                } finally {
                    setLoading(false);
                }
            };

            fetchInitialBalance();
        }, [])
    );

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Logout',
                    onPress: async () => {
                        const { error } = await signOut();
                        if (error) {
                            Alert.alert('Error', 'Failed to logout. Please try again.');
                        } else {
                            await logout();
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Auth', params: { screen: 'Login' } }],
                            });
                        }
                    }
                }
            ]
        );
    };

    const handleHelp = () => {
        // You can replace this URL with your actual help documentation
        Linking.openURL('https://spendwise.help.com');
    };

    const handlePrivacy = () => {
        // You can replace this URL with your actual privacy policy
        Linking.openURL('https://spendwise.privacy.com');
    };

    const handleAbout = () => {
        Alert.alert(
            'About SpendWise',
            'SpendWise v1.0.0\nA simple and efficient way to manage your finances.',
            [{ text: 'OK' }]
        );
    };

    const renderSettingItem = (icon: string, title: string, value?: any, onPress?: () => void, rightComponent?: React.ReactNode) => (
        <TouchableOpacity 
            style={styles.settingItem} 
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={styles.settingLeft}>
                <MaterialIcons name={icon} size={24} color="#4CAF50" />
                <Text style={styles.settingText}>{title}</Text>
            </View>
            <View style={styles.settingRight}>
                {value && <Text style={styles.settingValue}>{value}</Text>}
                {rightComponent}
                {onPress && <MaterialIcons name="chevron-right" size={24} color="#666" />}
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>
                {renderSettingItem(
                    'account-balance', 
                    'Initial Balance', 
                    loading ? 'Loading...' : `$${initialBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
                    () => navigation.navigate('EditInitialBalance')
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>
                <TouchableOpacity 
                    style={styles.settingItem}
                    onPress={() => navigation.navigate('Help')}
                >
                    <View style={styles.settingLeft}>
                        <MaterialIcons name="help-outline" size={24} color="#666" />
                        <Text style={styles.settingText}>Help</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.settingItem}
                    onPress={() => navigation.navigate('PrivacyPolicy')}
                >
                    <View style={styles.settingLeft}>
                        <MaterialIcons name="privacy-tip" size={24} color="#666" />
                        <Text style={styles.settingText}>Privacy Policy</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.settingItem}
                    onPress={() => navigation.navigate('About')}
                >
                    <View style={styles.settingLeft}>
                        <MaterialIcons name="info-outline" size={24} color="#666" />
                        <Text style={styles.settingText}>About</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <MaterialIcons name="logout" size={24} color="#FFF" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    section: {
        marginTop: 16,
        backgroundColor: '#FFF',
        borderRadius: 8,
        overflow: 'hidden',
    },
    sectionTitle: {
        fontSize: 14,
        color: '#666',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#F5F5F5',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 16,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingValue: {
        fontSize: 16,
        color: '#666',
        marginRight: 8,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F44336',
        margin: 16,
        padding: 16,
        borderRadius: 8,
    },
    logoutText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default SettingsScreen;
