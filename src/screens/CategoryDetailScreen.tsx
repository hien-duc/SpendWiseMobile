import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { reportsService } from '../api/reportsService';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const CategoryDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { isAuthenticated, logout } = useAuth();
    const { category, month, year } = route.params;
    const [monthlyData, setMonthlyData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategoryData = async () => {
        try {
            if (!isAuthenticated) {
                navigation.navigate('Login');
                return;
            }

            setLoading(true);
            const trends = await reportsService.getTrends('monthly');
            setMonthlyData(trends.filter(t => t.category === category));
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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

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
                <BarChart
                    data={{
                        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        datasets: [{
                            data: monthlyData.map(d => d.amount) || [0, 0, 0, 0, 70000, 23535]
                        }]
                    }}
                    width={width - 32}
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix="₩"
                    chartConfig={{
                        backgroundColor: '#FFF',
                        backgroundGradientFrom: '#FFF',
                        backgroundGradientTo: '#FFF',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(255, 87, 34, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#FF5722"
                        }
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            </View>

            <View style={styles.transactionList}>
                <View style={styles.transactionHeader}>
                    <View style={styles.dateInfo}>
                        <Text style={styles.dateText}>12.7 2024 (Sat)</Text>
                    </View>
                    <Text style={styles.amountText}>-23,535₩</Text>
                </View>
                <View style={styles.transactionItem}>
                    <View style={styles.categoryInfo}>
                        <MaterialIcons name="restaurant" size={24} color="#FF5722" />
                        <Text style={styles.categoryName}>Food</Text>
                    </View>
                    <Text style={styles.transactionAmount}>23,535₩</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFF',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    chartContainer: {
        margin: 16,
        padding: 16,
        backgroundColor: '#FFF',
        borderRadius: 12,
        elevation: 2,
    },
    transactionList: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        margin: 16,
        padding: 16,
    },
    transactionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    dateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 14,
        color: '#666',
    },
    amountText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF5722',
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryName: {
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
    },
    transactionAmount: {
        fontSize: 16,
        color: '#333',
    },
});

export default CategoryDetailScreen;
