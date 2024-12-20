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
            style={styles.goalCard}
            onPress={() => {
                setSelectedGoal(item);
                setShowOptions(true);
            }}
        >
            <View style={styles.goalHeader}>
                <Text style={styles.goalTitle} numberOfLines={1} ellipsizeMode="tail">
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
                <Text style={styles.progressText}>
                    {Math.min(
                        (item.current_amount / item.target_amount) * 100,
                        100
                    ).toFixed(0)}%
                </Text>
            </View>
            <View style={styles.goalDetails}>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Deadline</Text>
                    <Text style={styles.detailValue}>{new Date(item.deadline).toLocaleDateString()}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <Text style={styles.detailValue}>{item.status.replace('_', ' ').toUpperCase()}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (!isAuthenticated) {
        return (
            <View style={styles.emptyState}>
                <MaterialIcons name="flag" size={64} color="#ccc" style={styles.emptyStateIcon} />
                <Text style={styles.emptyStateText}>Please log in to view your goals</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
                >
                    <MaterialIcons name="login" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Financial Goals</Text>
                <Text style={styles.headerSubtitle}>Track your progress and stay on top of your finances</Text>
            </View>
            <View style={styles.content}>
                {loading ? (
                    <ActivityIndicator size="large" color="#4CAF50" style={styles.centerContainer} />
                ) : error ? (
                    <Text style={styles.emptyStateText}>{error}</Text>
                ) : goals.length === 0 ? (
                    <View style={styles.emptyState}>
                        <MaterialIcons name="flag" size={64} color="#ccc" style={styles.emptyStateIcon} />
                        <Text style={styles.emptyStateText}>No financial goals yet</Text>
                        <Text style={styles.emptyStateText}>Tap the + button to create your first goal</Text>
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
                                colors={['#4CAF50']}
                            />
                        }
                    />
                )}
            </View>
            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddGoal}
            >
                <MaterialIcons name="add" size={24} color="#fff" />
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
        backgroundColor: '#FFFFFF',
    },
    header: {
        backgroundColor: '#4CAF50',
        paddingTop: 48,
        paddingBottom: 24,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 24,
    },
    content: {
        flex: 1,
        marginTop: -12,
        paddingHorizontal: 20,
    },
    goalCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    goalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2E3A59',
        flex: 1,
        marginRight: 16,
    },
    goalAmount: {
        fontSize: 24,
        fontWeight: '700',
        color: '#4CAF50',
    },
    progressContainer: {
        marginBottom: 16,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#F0F4F8',
        borderRadius: 4,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        color: '#8F9BB3',
    },
    goalDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F4F8',
    },
    detailItem: {
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 12,
        color: '#8F9BB3',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2E3A59',
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyStateIcon: {
        marginBottom: 24,
        opacity: 0.5,
    },
    emptyStateText: {
        fontSize: 18,
        color: '#8F9BB3',
        textAlign: 'center',
        lineHeight: 24,
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
