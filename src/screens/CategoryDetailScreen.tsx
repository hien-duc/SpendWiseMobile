import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dimensions } from 'react-native';
import { reportsService } from '../api/reportsService';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const CategoryDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { isAuthenticated, logout } = useAuth();
    const { category, month, year } = route.params;
    const [monthlyData, setMonthlyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [maxAmount, setMaxAmount] = useState(0);

    const fetchCategoryData = async () => {
        try {
            if (!isAuthenticated) {
                navigation.navigate('Login');
                return;
            }

            setLoading(true);
            const trends = await reportsService.getTrends('monthly');
            const filteredData = trends.filter(t => t.category === category);
            setMonthlyData(filteredData);

            // Calculate max amount for scaling
            const max = Math.max(...filteredData.map(d => d.amount), 1);
            setMaxAmount(max);
        } catch (error) {
            console.error('Error fetching category data:', error);
            if (error.response?.status === 401) {
                Alert.alert(
                    'Session Expired',
                    'Your session has expired. Please log in again.',
                    [{
                        text: 'OK',
                        onPress: async () => {
                            await logout();
                            navigation.navigate('Login');
                        }
                    }]
                );
            } else {
                Alert.alert('Error', 'Unable to fetch category data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryData();
    }, [isAuthenticated]);

    const renderBar = (amount: number, index: number, label: string) => {
        const barHeight = (amount / maxAmount) * 200; // Max height of 200

        return (
            <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                    <View
                        style={[
                            styles.bar,
                            {
                                height: barHeight,
                                backgroundColor: '#FF5722'
                            }
                        ]}
                    />
                </View>
                <Text style={styles.barLabel}>{label}</Text>
                <Text style={styles.barValue}>
                    ₩{amount.toLocaleString()}
                </Text>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = monthlyData.length > 0
        ? monthlyData.map(d => d.amount)
        : [0, 0, 0, 0, 70000, 23535];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>{category} (Dec)</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.chartContainer}>
                <View style={styles.chart}>
                    {chartData.map((amount, index) =>
                        renderBar(amount, index, months[index])
                    )}
                </View>
            </View>

            <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Summary</Text>
                {monthlyData.map((data, index) => (
                    <View key={index} style={styles.summaryRow}>
                        <Text style={styles.summaryMonth}>{months[index]}</Text>
                        <Text style={styles.summaryAmount}>
                            ₩{data.amount.toLocaleString()}
                        </Text>
                    </View>
                ))}
            </View>
        </ScrollView>
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
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartContainer: {
        margin: 16,
        padding: 16,
        backgroundColor: '#FFF',
        borderRadius: 8,
        elevation: 2,
    },
    chart: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 250,
        paddingTop: 20,
    },
    barContainer: {
        flex: 1,
        alignItems: 'center',
    },
    barWrapper: {
        height: 200,
        justifyContent: 'flex-end',
    },
    bar: {
        width: 20,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    barLabel: {
        marginTop: 8,
        fontSize: 12,
        color: '#666',
    },
    barValue: {
        fontSize: 10,
        color: '#666',
        marginTop: 4,
    },
    summaryContainer: {
        margin: 16,
        padding: 16,
        backgroundColor: '#FFF',
        borderRadius: 8,
        elevation: 2,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    summaryMonth: {
        fontSize: 14,
        color: '#666',
    },
    summaryAmount: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
});

export default CategoryDetailScreen;