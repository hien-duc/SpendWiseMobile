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
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F4F8',
        backgroundColor: '#FFFFFF',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    backButton: {
        padding: 12,
        borderRadius: 40,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2E3A59',
        letterSpacing: 0.5,
    },
    placeholder: {
        width: 48,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginVertical: 40,
    },
    lottie: {
        width: 220,
        height: 220,
    },
    appName: {
        fontSize: 36,
        fontWeight: '700',
        color: '#2E3A59',
        marginTop: 24,
        letterSpacing: 0.5,
    },
    version: {
        fontSize: 18,
        color: '#8F9BB3',
        marginTop: 8,
    },
    section: {
        marginBottom: 32,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#2E3A59',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    sectionContent: {
        fontSize: 16,
        color: '#8F9BB3',
        lineHeight: 24,
    },
    bulletPoint: {
        fontSize: 16,
        color: '#8F9BB3',
        marginBottom: 12,
        lineHeight: 24,
    },
    footer: {
        padding: 24,
        alignItems: 'center',
    },
    copyright: {
        fontSize: 14,
        color: '#8F9BB3',
    },
});

export default AboutScreen;
