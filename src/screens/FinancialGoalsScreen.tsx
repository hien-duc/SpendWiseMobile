import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Modal,
    Alert,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { financialGoalsService } from '../api/financialGoalsService';
import { FinancialGoal, GoalStatus } from '../api/types';
import { useAuth } from '../hooks/useAuth';

export const FinancialGoalsScreen = () => {
    const navigation = useNavigation();
    const { session, isAuthenticated } = useAuth();
    const [goals, setGoals] = useState<FinancialGoal[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchGoals = useCallback(async () => {
        if (!isAuthenticated || !session?.user?.id) {
            Alert.alert('Error', 'Please log in to view financial goals');
            navigation.navigate('Auth', { screen: 'Login' });
            setLoading(false);
            return;
        }

        try {
            setError(null);
            const data = await financialGoalsService.getAll(session.user.id);
            setGoals(data || []);
        } catch (error) {
            console.error('Error fetching goals:', error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Failed to fetch goals. Please try again.');
            }
            setGoals([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [isAuthenticated, session?.user?.id, navigation]);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchGoals();
        }, [fetchGoals])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchGoals();
    }, [fetchGoals]);

    const handleDeleteGoal = async () => {
        if (!selectedGoal || !session?.user?.id) return;

        try {
            setLoading(true);
            await financialGoalsService.delete(selectedGoal.id, session.user.id);
            setShowOptions(false);
            setSelectedGoal(null);
            fetchGoals();
            Alert.alert('Success', 'Goal deleted successfully');
        } catch (error) {
            console.error('Error deleting goal:', error);
            Alert.alert('Error', 'Failed to delete goal. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditGoal = () => {
        if (!selectedGoal || !session?.user?.id) return;
        setShowOptions(false);
        navigation.navigate('EditGoal', { 
            goal: selectedGoal,
            userId: session.user.id 
        });
    };

    const handleAddGoal = () => {
        if (!session?.user?.id) {
            Alert.alert('Error', 'Please log in to add a goal');
            navigation.navigate('Auth', { screen: 'Login' });
            return;
        }
        navigation.navigate('AddGoal', { userId: session.user.id });
    };

    const renderGoalItem = ({ item }: { item: FinancialGoal }) => (
        <TouchableOpacity
            style={styles.goalItem}
            onPress={() => {
                setSelectedGoal(item);
                setShowOptions(true);
            }}
        >
            <View style={styles.goalHeader}>
                <Text style={styles.goalName} numberOfLines={1} ellipsizeMode="tail">
                    {item.name}
                </Text>
                <Text style={styles.goalAmount}>${item.current_amount} / ${item.target_amount}</Text>
            </View>
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${Math.min(
                                    (item.current_amount / item.target_amount) * 100,
                                    100
                                )}%`,
                            },
                        ]}
                    />
                </View>
            </View>
            <View style={styles.goalDetails}>
                <Text style={styles.goalInfo}>
                    Deadline: {new Date(item.deadline).toLocaleDateString()}
                </Text>
                <View style={styles.statusContainer}>
                    <Text style={styles.statusBadge}>
                        {item.status.replace('_', ' ').toUpperCase()}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (!isAuthenticated) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Please log in to view your goals</Text>
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
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Financial Goals</Text>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#00B152" />
                </View>
            ) : error ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : goals.length === 0 ? (
                <View style={styles.centerContainer}>
                    <MaterialIcons name="flag" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>No financial goals yet</Text>
                    <Text style={styles.emptySubText}>Tap the + button to create your first goal</Text>
                </View>
            ) : (
                <FlatList
                    data={goals}
                    renderItem={renderGoalItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#00B152']}
                        />
                    }
                />
            )}

            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddGoal}
            >
                <View style={styles.addButtonContent}>
                    <MaterialIcons name="add" size={24} color="#FFF" />
                    <Text style={styles.addButtonText}>Add New Goal</Text>
                </View>
            </TouchableOpacity>

            <Modal
                visible={showOptions}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowOptions(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowOptions(false)}
                >
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={handleEditGoal}
                        >
                            <MaterialIcons name="edit" size={24} color="#2196F3" />
                            <Text style={styles.modalOptionText}>Edit Goal</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={handleDeleteGoal}
                        >
                            <MaterialIcons name="delete" size={24} color="#F44336" />
                            <Text style={[styles.modalOptionText, { color: '#F44336' }]}>
                                Delete Goal
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#ff6b6b',
        textAlign: 'center',
    },
    addButton: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: '#00B152',
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    addButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    listContent: {
        padding: 16,
    },
    goalItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    goalName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    goalAmount: {
        fontSize: 16,
        fontWeight: '500',
        color: '#00B152',
    },
    progressContainer: {
        marginVertical: 8,
        width: '100%',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
        width: '100%',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#00B152',
        borderRadius: 4,
    },
    goalDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    goalInfo: {
        fontSize: 14,
        color: '#666',
        flex: 1,
        marginRight: 8,
    },
    statusContainer: {
        alignItems: 'flex-end',
    },
    statusBadge: {
        fontSize: 12,
        fontWeight: '500',
        color: '#00B152',
        backgroundColor: '#e8f5e9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        width: '80%',
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    modalOptionText: {
        fontSize: 16,
        marginLeft: 12,
    },
});
