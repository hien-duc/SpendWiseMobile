import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Svg, { G, Path, Circle } from 'react-native-svg';
import { otherService } from '../api/otherService';

const { width } = Dimensions.get('window');
const CHART_SIZE = width * 0.7;
const RADIUS = CHART_SIZE / 2;
const CENTER = CHART_SIZE / 2;

interface CategoryData {
    category_name: string;
    category_icon: string;
    category_color: string;
    total_amount: number;
    percentage: number;
    transaction_type: 'expense' | 'income' | 'investment';
}

const CategoryAnnualReportScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isAuthenticated, session } = useAuth();
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [activeTab, setActiveTab] = useState<'expense' | 'income' | 'investment'>('expense');
    const [refreshing, setRefreshing] = useState(false);

    const fetchAnnualReport = async () => {
        try {
            if (!isAuthenticated) {
                navigation.navigate('LoginScreen');
                return;
            }

            setLoading(true);
            const data = await otherService.getAnnualCategoriesReport(year, session);
            setCategoryData(data);
        } catch (error) {
            console.error('Error fetching annual report:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAnnualReport();
    }, [year, isAuthenticated]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchAnnualReport();
    };

    const renderPieChart = () => {
        const filteredCategories = categoryData.filter(cat => 
            cat.transaction_type === activeTab && cat.total_amount > 0
        );

        if (filteredCategories.length === 0) {
            return (
                <View style={styles.noDataContainer}>
                    <MaterialIcons name="donut-large" size={48} color="#ccc" />
                    <Text style={styles.noDataText}>No data available for {year}</Text>
                </View>
            );
        }

        const total = filteredCategories.reduce((sum, cat) => sum + cat.total_amount, 0);
        let currentAngle = 0;

        // Handle single category case
        if (filteredCategories.length === 1) {
            return (
                <View style={styles.chartContainer}>
                    <Svg width={CHART_SIZE} height={CHART_SIZE}>
                        <G x={CENTER} y={CENTER}>
                            <Circle
                                r={RADIUS}
                                fill={filteredCategories[0].category_color}
                            />
                            <Circle
                                cx={0}
                                cy={0}
                                r={15}
                                fill="white"
                            />
                            <MaterialIcons
                                name={filteredCategories[0].category_icon}
                                size={20}
                                color={filteredCategories[0].category_color}
                                style={{
                                    position: 'absolute',
                                    left: CENTER - 10,
                                    top: CENTER - 10,
                                }}
                            />
                        </G>
                    </Svg>

                    <View style={styles.legendContainer}>
                        {renderCategoryItem(filteredCategories[0])}
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.chartContainer}>
                <Svg width={CHART_SIZE} height={CHART_SIZE}>
                    <G x={CENTER} y={CENTER}>
                        {filteredCategories.map((category, index) => {
                            const angle = (category.percentage / 100) * 360;
                            const x1 = Math.cos((currentAngle - 90) * Math.PI / 180) * RADIUS;
                            const y1 = Math.sin((currentAngle - 90) * Math.PI / 180) * RADIUS;
                            const x2 = Math.cos((currentAngle + angle - 90) * Math.PI / 180) * RADIUS;
                            const y2 = Math.sin((currentAngle + angle - 90) * Math.PI / 180) * RADIUS;

                            const path = `
                                M 0 0
                                L ${x1} ${y1}
                                A ${RADIUS} ${RADIUS} 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2}
                                Z
                            `;

                            currentAngle += angle;
                            return (
                                <Path
                                    key={index}
                                    d={path}
                                    fill={category.category_color}
                                />
                            );
                        })}
                    </G>
                </Svg>

                <View style={styles.legendContainer}>
                    {filteredCategories.map((category, index) => renderCategoryItem(category, index))}
                </View>
            </View>
        );
    };

    const renderCategoryItem = (category: CategoryData, index?: number) => (
        <View key={index} style={styles.legendItem}>
            <View style={styles.legendIconContainer}>
                <MaterialIcons
                    name={category.category_icon}
                    size={24}
                    color={category.category_color}
                />
            </View>
            <View style={styles.legendTextContainer}>
                <Text style={styles.legendTitle}>{category.category_name}</Text>
                <Text style={styles.legendAmount}>
                    ${category.total_amount.toFixed(2)} ({category.percentage.toFixed(1)}%)
                </Text>
            </View>
        </View>
    );

    const handleYearChange = (increment: number) => {
        setYear(prev => prev + increment);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Annual Report</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.yearSelector}>
                <TouchableOpacity onPress={() => handleYearChange(-1)}>
                    <MaterialIcons name="chevron-left" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.yearText}>{year}</Text>
                <TouchableOpacity onPress={() => handleYearChange(1)}>
                    <MaterialIcons name="chevron-right" size={28} color="#333" />
                </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
                {(['expense', 'income', 'investment'] as const).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tab,
                            activeTab === tab && styles.activeTab
                        ]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === tab && styles.activeTabText
                        ]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#6200ee" />
                        <Text style={styles.loadingText}>Loading data...</Text>
                    </View>
                ) : (
                    renderPieChart()
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
    yearSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    yearText: {
        fontSize: 20,
        fontWeight: '600',
        marginHorizontal: 20,
    },
    content: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 4,
        margin: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeTab: {
        backgroundColor: '#fff',
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        color: '#666',
    },
    activeTabText: {
        color: '#6200ee',
        fontWeight: '500',
    },
    chartContainer: {
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        elevation: 2,
    },
    legendContainer: {
        width: '100%',
        marginTop: 24,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#F5F5F5',
        padding: 8,
        borderRadius: 8,
    },
    legendIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    legendTextContainer: {
        flex: 1,
    },
    legendTitle: {
        fontSize: 14,
        fontWeight: '500',
    },
    legendAmount: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    noDataContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    noDataText: {
        marginTop: 8,
        color: '#666',
        textAlign: 'center',
    },
    loadingContainer: {
        padding: 32,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 8,
        color: '#666',
    },
});

export default CategoryAnnualReportScreen;
