import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../supabase';

const AuthDebugScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authLogs, setAuthLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        setAuthLogs(prevLogs => [...prevLogs, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    const clearLogs = () => {
        setAuthLogs([]);
    };

    const handleSignUp = async () => {
        try {
            addLog('Attempting to sign up...');

            // Generate a unique test email
            const testEmail = `test_user_${Date.now()}@example.com`;

            const { data, error } = await supabase.auth.signUp({
                email: testEmail,
                password: password
            });

            if (error) {
                addLog(`Sign Up Error: ${error.message}`);
                Alert.alert('Sign Up Error', error.message);
                return;
            }

            addLog(`Sign Up Successful: ${testEmail}`);
            Alert.alert('Success', `Sign up successful for ${testEmail}`);

            // Update email state for subsequent login
            setEmail(testEmail);
        } catch (error: any) {
            addLog(`Unexpected Sign Up Error: ${error.message}`);
            Alert.alert('Error', error.message);
        }
    };

    const handleLogin = async () => {
        try {
            addLog('Attempting to log in...');

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                addLog(`Login Error: ${error.message}`);
                Alert.alert('Login Error', error.message);
                return;
            }

            // Get the current session
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                // Store token in AsyncStorage
                await AsyncStorage.setItem('token', session.access_token);

                addLog('Login Successful');
                addLog(`Access Token: ${session.access_token.substring(0, 20)}...`);

                // Get current user details
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    addLog(`Logged in as: ${user.email}`);
                }

                Alert.alert('Success', 'Login successful');
            }
        } catch (error: any) {
            addLog(`Unexpected Login Error: ${error.message}`);
            Alert.alert('Error', error.message);
        }
    };

    const checkSession = async () => {
        try {
            addLog('Checking current session...');

            // Check Supabase session with error handling
            let session = null;
            let user = null;
            let storedToken = null;

            try {
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                session = currentSession;
            } catch (sessionError) {
                addLog(`Session Retrieval Error: ${sessionError.message}`);
            }

            try {
                const { data: { user: currentUser } } = await supabase.auth.getUser();
                user = currentUser;
            } catch (userError) {
                addLog(`User Retrieval Error: ${userError.message}`);
            }

            try {
                storedToken = await AsyncStorage.getItem('token');
            } catch (tokenError) {
                addLog(`Token Retrieval Error: ${tokenError.message}`);
            }

            // Detailed logging
            addLog(`Session Present: ${!!session}`);
            addLog(`User Present: ${!!user}`);
            addLog(`Stored Token: ${storedToken ? 'Yes' : 'No'}`);

            if (user) {
                addLog(`Logged in as: ${user.email}`);
            }

            // Comprehensive alert
            Alert.alert(
                'Session Check',
                `Session: ${session ? 'Active' : 'Inactive'}\n` +
                `User: ${user?.email || 'Not logged in'}\n` +
                `Token: ${storedToken ? 'Present' : 'Not Found'}`,
                [{ text: 'OK' }]
            );
        } catch (error: any) {
            addLog(`Unexpected Session Check Error: ${error.message}`);
            Alert.alert('Error', 'Unable to check session', [{ text: 'OK' }]);
        }
    };

    const handleLogout = async () => {
        try {
            addLog('Attempting to log out...');

            // Sign out from Supabase
            const { error } = await supabase.auth.signOut();

            if (error) {
                addLog(`Logout Error: ${error.message}`);
                Alert.alert('Logout Error', error.message);
                return;
            }

            // Remove token from AsyncStorage
            await AsyncStorage.removeItem('token');

            addLog('Logout Successful');
            Alert.alert('Success', 'Logged out successfully');
        } catch (error: any) {
            addLog(`Unexpected Logout Error: ${error.message}`);
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Authentication Debug</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={checkSession}>
                    <Text style={styles.buttonText}>Check Session</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.clearButton} onPress={clearLogs}>
                <Text style={styles.clearButtonText}>Clear Logs</Text>
            </TouchableOpacity>

            <Text style={styles.logsTitle}>Authentication Logs:</Text>
            <ScrollView style={styles.logsContainer}>
                {authLogs.map((log, index) => (
                    <Text key={index} style={styles.logText}>{log}</Text>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#00B152',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '48%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    clearButton: {
        backgroundColor: '#FF5252',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    clearButtonText: {
        color: 'white',
        fontSize: 14,
    },
    logsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    logsContainer: {
        flex: 1,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        padding: 10,
    },
    logText: {
        fontSize: 12,
        marginBottom: 5,
        fontFamily: 'monospace',
    },
});

export default AuthDebugScreen;
