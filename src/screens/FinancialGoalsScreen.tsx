import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

interface Props {
}

const FinancialGoalsScreen: React.FC<Props> = () => {
    const navigation = useNavigation();
    const renderGoalItem = (icon: string, title: string, target: string, current: string, deadline: string) => (
        <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
                <View style={styles.goalLeft}>
                    <MaterialIcons name={icon} size={24} color="#666" />
                    <Text style={styles.goalTitle}>{title}</Text>
                </View>
                <Text style={styles.goalDeadline}>{deadline}</Text>
            </View>
            <View style={styles.goalProgress}>
                <View style={styles.goalAmounts}>
                    <Text style={styles.goalCurrent}>Current: {current}</Text>
                    <Text style={styles.goalTarget}>Target: {target}</Text>
                </View>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${Math.min(parseInt(current.replace(/[^0-9]/g, '')) / parseInt(target.replace(/[^0-9]/g, '')) * 100, 100)}%` }
                        ]}
                    />
                </View>
            </View>
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
                <Text style={styles.headerTitle}>Financial Goals</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Active Goals</Text>
                    {renderGoalItem(
                        'home',
                        'House Down Payment',
                        '$50,000',
                        '$30,000',
                        'Dec 2024'
                    )}
                    {renderGoalItem(
                        'directions-car',
                        'New Car',
                        '$25,000',
                        '$10,000',
                        'Jun 2024'
                    )}
                    {renderGoalItem(
                        'school',
                        'Emergency Fund',
                        '$15,000',
                        '$12,000',
                        'Mar 2024'
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Completed Goals</Text>
                    {renderGoalItem(
                        'laptop',
                        'New Laptop',
                        '$2,000',
                        '$2,000',
                        'Completed'
                    )}
                </View>

                <TouchableOpacity style={styles.addButton}>
                    <MaterialIcons name="add-circle" size={24} color="#2196F3" />
                    <Text style={styles.addButtonText}>Add New Goal</Text>
                </TouchableOpacity>
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
        marginBottom: 16,
    },
    goalItem: {
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    goalLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    goalTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginLeft: 12,
    },
    goalDeadline: {
        fontSize: 12,
        color: '#666',
    },
    goalProgress: {
        marginTop: 8,
    },
    goalAmounts: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    goalCurrent: {
        fontSize: 14,
        color: '#2196F3',
    },
    goalTarget: {
        fontSize: 14,
        color: '#666',
    },
    progressBar: {
        height: 6,
        backgroundColor: '#E0E0E0',
        borderRadius: 3,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#2196F3',
        borderRadius: 3,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#FFF',
        borderRadius: 8,
        marginBottom: 16,
    },
    addButtonText: {
        fontSize: 16,
        color: '#2196F3',
        marginLeft: 8,
    },
});

export default FinancialGoalsScreen;
