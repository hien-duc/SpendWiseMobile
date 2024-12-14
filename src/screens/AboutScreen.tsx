import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';

const AboutScreen = () => {
    const navigation = useNavigation();
    const appVersion = '1.0.0';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.logoContainer}>
                    {/* can you  the actual SpendWise logo for this */}
                    <LottieView
                        source={require('../../assets/lottie.json')}
                        autoPlay
                        loop
                        style={styles.lottie}
                    />
                    {/* <MaterialIcons name="account-balance-wallet" size={80} color="#4CAF50" /> */}
                    <Text style={styles.appName}>SpendWise</Text>
                    <Text style={styles.version}>Version {appVersion}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About SpendWise</Text>
                    <Text style={styles.sectionContent}>
                        SpendWise is your personal finance companion, designed to help you make smarter financial decisions.
                        Track your expenses, monitor your investments, and achieve your financial goals with ease.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Features</Text>
                    <Text style={styles.bulletPoint}>• Expense Tracking</Text>
                    <Text style={styles.bulletPoint}>• Income Management</Text>
                    <Text style={styles.bulletPoint}>• Investment Monitoring</Text>
                    <Text style={styles.bulletPoint}>• Financial Reports</Text>
                    <Text style={styles.bulletPoint}>• Budget Planning</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Us</Text>
                    <Text style={styles.sectionContent}>
                        Email: contact@spendwise.com{'\n'}
                        Website: www.spendwise.com{'\n'}
                        Follow us on social media @SpendWise
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.copyright}>
                        2024 SpendWise. All rights reserved.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
    },
    logoContainer: {
        alignItems: 'center',
        padding: 32,
    },
    lottie: {
        width: 100, // Adjust size as needed
        height: 100,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    version: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    sectionContent: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    bulletPoint: {
        fontSize: 14,
        color: '#666',
        lineHeight: 24,
        marginLeft: 8,
    },
    footer: {
        padding: 16,
        alignItems: 'center',
    },
    copyright: {
        fontSize: 12,
        color: '#999',
    },
});

export default AboutScreen;
