import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PrivacyPolicyScreen = () => {
    const navigation = useNavigation();

    const renderSection = (title: string, content: string) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.sectionContent}>{content}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                {renderSection(
                    'Information We Collect',
                    'We collect information that you provide directly to us, including your name, email address, and financial transaction data. This information is used to provide and improve our services.'
                )}

                {renderSection(
                    'How We Use Your Information',
                    'Your information is used to provide our core functionality, improve our services, and send you important updates. We never sell your personal data to third parties.'
                )}

                {renderSection(
                    'Data Security',
                    'We implement industry-standard security measures to protect your personal and financial information. All data is encrypted during transmission and storage.'
                )}

                {renderSection(
                    'Your Rights',
                    'You have the right to access, correct, or delete your personal data. You can also request a copy of your data or restrict its processing.'
                )}

                {renderSection(
                    'Data Retention',
                    'We retain your data only for as long as necessary to provide our services and comply with legal obligations. You can request data deletion at any time.'
                )}

                {renderSection(
                    'Updates to Policy',
                    'We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.'
                )}

                {renderSection(
                    'Contact Us',
                    'If you have any questions about this privacy policy, please contact us at privacy@spendwise.com'
                )}
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
        padding: 16,
    },
    section: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 16,
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
});

export default PrivacyPolicyScreen;