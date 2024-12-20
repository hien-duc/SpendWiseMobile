import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import { otherService } from '../api/otherService';
import { useAuth } from '../hooks/useAuth';

interface Props {
    onBack?: () => void;
}

interface CategoryData {
    category: string;
    percentage: number;
    icon: string;
    color: string;
}

const AllTimeCategoryReportScreen: React.FC<Props> = () => {
    const navigation = useNavigation();
    const screenWidth = Dimensions.get('window').width;
    const { session } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);

    useEffect(() => {
        if (session) {
            fetchCategoryData();
        }
    }, []);

    const fetchCategoryData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await otherService.getAllTimeCategoriesSummary(session);
            setCategoryData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
        } finally {
            setLoading(false);
        }
    };

    const chartData = categoryData.map((item) => ({
        name: item.category,
        population: item.percentage,
        color: item.color,
        legendFontColor: '#7F7F7F',
        legendFontSize: 12
    }));

    const renderCategoryItem = (data: CategoryData) => {
        // Safely handle percentage display
        const formattedPercentage = data.percentage != null 
            ? data.percentage.toFixed(2) 
            : 'N/A';

        return (
            <View key={data.category} style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                    <MaterialIcons 
                        name={data.icon || 'help-outline'} 
                        size={24} 
                        color={data.color || '#CCCCCC'} 
                    />
                    <Text style={styles.categoryName}>{data.category}</Text>
                </View>
                <View style={styles.categoryRight}>
                    <Text style={styles.categoryPercentage}>{`${formattedPercentage}%`}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Category Report</Text>
                <Text style={styles.headerSubtitle}>
                    Analyze your spending patterns across all categories
                </Text>
            </View>

            <ScrollView style={styles.content}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : (
                    <View>
                        {categoryData.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Overall Category Distribution</Text>
                                <PieChart
                                    data={chartData}
                                    width={screenWidth - 64}
                                    height={220}
                                    chartConfig={{
                                        backgroundColor: '#ffffff',
                                        backgroundGradientFrom: '#ffffff',
                                        backgroundGradientTo: '#ffffff',
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    }}
                                    accessor="population"
                                    backgroundColor="transparent"
                                    paddingLeft="15"
                                    absolute
                                />
                            </View>
                        )}
                        {categoryData.length > 0 ? (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Category Details</Text>
                                {categoryData.map(renderCategoryItem)}
                            </View>
                        ) : (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>No category data available</Text>
                            </View>
                        )}
                    </View>
                )}
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
        backgroundColor: '#4CAF50',
        paddingTop: 48,
        paddingBottom: 24,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    backButton: {
        marginTop: -25,
        paddingBottom: 20,
        color: 'white',
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
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorText: {
        color: '#FF3B30',
        textAlign: 'center',
        fontSize: 16,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginVertical: 6,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    categoryLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    categoryName: {
        marginLeft: 12,
        fontSize: 16,
        color: '#333333',
        fontWeight: '500',
    },
    categoryRight: {
        marginLeft: 8,
    },
    categoryPercentage: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    section: {
        backgroundColor: '#FFFFFF',
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
});

export default AllTimeCategoryReportScreen;
